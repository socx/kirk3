import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  activateUser,
  authenticate,
  clearToken,
  createUser,
  fetchAllUsers,
  fetchUser,
  findUserByEmail,
  findUserByEmailAndUpdatePassword,
  generatePasswordResetToken,
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

  // create user
  let user = await createUser(fullname, email, password, team);

  // add default permissions
  let permissions = [
    '80f576e1-34ec-4e3e-b1bd-64fbe69e4bc9', // View Finance Expenses
    'c8e3a02e-67bf-4853-9d9b-eb9c3c870d95' // Edit Finance Expenses
  ];

  if (team.toUpperCase() === 'LEADERSHIP') {
    permissions.concat([
      '76abab39-b6d3-4e02-bbd2-0a732b16e4b9', // View Dashboard
      'c967925c-f253-49e5-a53c-edce24a7cb70', // Approve Finance Expenses
      '5a3f0226-f710-43e0-b080-fb59bb9572c0', // Pay Finance Expenses
      '62f5c51d-3727-4423-b40f-d92497866754', // Delete Finance Expenses
    ]);
  }

  if (user?.userId) {
    user = await updateUser(user.userId, { permissions } ) ?? user;
  }

  if (user) {
    // send notification email
    const emailDetails : EmailDetails = {
      user,
      templateType: EmailTemplateTypes.UserRegistrationConfirmation,
    };
    sendEmail(emailDetails);

    return res.status(StatusCodes.CREATED).json({success: "User registered successfully", user});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not register user at this time`});
  }
};

export const completeUserSignUp = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { token } = req.body;
    const user = await activateUser(token, email);
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

    return res.status(StatusCodes.OK).json({ message: 'Authenticated successfully', user});
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
}

export const logoutUser = async (req: Request, res: Response) => {

  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(StatusCodes.NO_CONTENT).json({message : `No access token`});
  }

  const user = await clearToken(accessToken);
  return res.status(StatusCodes.NO_CONTENT).json({message : `logged out`});
}

export const initiatePasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const token = await generatePasswordResetToken(email);
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
  const { email } = req.params;
  const { password } = req.body;
  const user = await findUserByEmailAndUpdatePassword(email, password);
  
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
