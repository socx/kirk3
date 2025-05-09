import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createUser } from "../services/userServicesSql";
import { fetchAllUsersSql } from "../db/userDb";
import {
  activateUser,
  authenticate,
  clearToken,
  // createUser,
  fetchAllUsers,
  fetchUser,
  findUserByEmail,
  findUserByEmailAndUpdatePassword,
  generateAccessToken,
  refreshAccessToken,
  updateUser,
} from "../services/userServices";
import { EmailDetails, EmailTemplateTypes, sendEmail } from "../services/emailService";

export const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, password, team } = req.body;
  if (!fullname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Username and password are required.' });
  }

  // check for duplicates
  const duplicate = await findUserByEmail(email);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "User with this email already exists",});
  }

  let user = await createUser(fullname, email, password);
  if (user) {
    // add default permissions
    const defaultUserPermissions = process.env.DEFAULT_USER_PERMISSIONS;
    const permissions = defaultUserPermissions?.split("|");
    updateUser(user.id, { permissions });
    // send notification email
    const token = await generateAccessToken(email);
    const emailDetails : EmailDetails = {
      user,
      templateType: EmailTemplateTypes.UserRegistrationNotification,
      token,
    };
    sendEmail(emailDetails);

    return res.status(StatusCodes.CREATED).json({success: "User registered successfully", user});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not register user at this time`});
  }
};

export const completeUserSignUp = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await activateUser(token);
    if (user) {
      const emailDetails : EmailDetails = {
        user,
        templateType: EmailTemplateTypes.UserRegistrationConfirmation,
      };
      sendEmail(emailDetails);
      return res.status(StatusCodes.OK).json({message: "Sign up completed successfully", user});
    } else {
      return res.status(StatusCodes.NO_CONTENT).json({message: `Could not find any matching user`});
    }
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, } = req.body;
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Email and password are required.' });
    }

    const user = await authenticate(email as string, password as string);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({message : `Invalid email and/or password`});
    }

    // Creates Secure Cookie with refresh token
    res.cookie(
      'jwt',
      user.refreshToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      }
    );

    return res.status(StatusCodes.OK).json({ message: 'Authenticated successfully', user});
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  // UNFORTUNATELY WE CANNOT HAVE CROSS-DOMAIN COOKIES AS FE AND BE ARE HOSTED ON DIFFERENT DOMAINS
  // SO WE'LL SEND REFRESHTOKEN VIA REQUEST BODY
  // const cookies = req.cookies;
  // if (!cookies?.jwt) {
  //   return res.status(StatusCodes.UNAUTHORIZED).json({message : `Invalid cookies`});
  // }
  // const refreshToken = cookies.jwt;
  
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(StatusCodes.FORBIDDEN).json({message : `Invalid refresh token`});
  }

  const user = await refreshAccessToken(refreshToken);
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({message : `Could not refresh token`});
  }

  return res.status(StatusCodes.OK).json({ message: 'Token refreshed successfully', user});
}

export const logoutUser = async (req: Request, res: Response) => {

  // MAY BE NEEDED IF EVER FE AND BE GET HOSTED ON SAME DOMAIN
  // THEN HTTP COOKIES CAN BE USED
  // if (!cookies?.jwt) return res.sendStatus(204); //No content
  // const refreshToken = cookies.jwt;
  // res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(StatusCodes.NO_CONTENT).json({message : `No refresh token`});
  }

  const user = await clearToken(refreshToken);
  return res.status(StatusCodes.NO_CONTENT).json({message : `logged out`});
}

export const initiatePasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const token = await generateAccessToken(email);
  const user = await findUserByEmail(email);
  if(user) {
    const emailDetails : EmailDetails = {
      templateType: EmailTemplateTypes.UserPasswordResetInitiation,
      user,
      token,
    }
    sendEmail(emailDetails);
    return res.status(StatusCodes.OK).json({message: "Password reset initiated successfully", user});
  }

  return res.status(StatusCodes.BAD_REQUEST);
};

export const changePassword = async (req: Request, res: Response) => {
  const { password, token } = req.body;
  const user = await findUserByEmailAndUpdatePassword(password, token);
  
  if(user) {
    const emailDetails : EmailDetails = {
      templateType: EmailTemplateTypes.UserPasswordResetCompletion,
      user,
    }
    sendEmail(emailDetails);
    return res.status(StatusCodes.OK).json({message: "Password updated successfully", user});
  }
  return res.status(StatusCodes.BAD_REQUEST);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await fetchAllUsers();
  if (users) {
    return res.status(StatusCodes.OK).json({message: "Users fetched successfully", users}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any users`});
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await fetchUser(id);
  if (user) {
    return res.status(StatusCodes.OK).json({message: "User fetched successfully", user}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find user`});
};

export const updateUserPermissions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permissions }= req.body;
  
  const user = await updateUser(id, permissions);
  if (user) {
    return res.status(StatusCodes.OK).json({message: "User permission updated successfully", user}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find user`});
}


// MySql
export const getAllSqlUsers = async (req: Request, res: Response) => {
  const users = await fetchAllUsersSql();
  if (users) {
    return res.status(StatusCodes.OK).json({message: "Users fetched successfully", users}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any users`});
};

export const registerUserSql = async (req: Request, res: Response) => {
  const { fullname, email, password, } = req.body;
  if (!fullname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Username and password are required.' });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : `Could not create users`});
};
