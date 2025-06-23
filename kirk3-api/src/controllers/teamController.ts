import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  createTeam,
  retrieveTeams,
  retrieveTeam,
  retrieveTeamByName,
  updateTeam,
  deleteTeam,
} from "../services/teamService";


export const getTeams = async (req: Request, res: Response) => {
  const teams = await retrieveTeams();
  if (teams) {
    return res.status(StatusCodes.OK).json({message: "Teams fetched successfully", teams}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any Teams`});
};

export const getTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const team = await retrieveTeam(id);
  if (team) {
    return res.status(StatusCodes.OK).json({message: "Team fetched successfully", team}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any Team`});
};

export const insertTeam = async (req: Request, res: Response) => {
  const { teamName,} = req.body;
  console.log({teamName,});
  if (!teamName) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'teamName is required.' });
  }

  // check for duplicates
  const duplicate = await retrieveTeamByName(teamName);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "Team with this code already exists",});
  }

  const team = await createTeam(teamName,);
  if (team) {
    return res.status(StatusCodes.CREATED).json({success: "Team inserted successfully", team});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not insert team at this time`});
  }
};

export const editTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { teamName } = req.body;

  if (!teamName) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'teamName required.'});
  }

  const team = await updateTeam(id, { teamName });
  if (team) {
    return res.status(StatusCodes.OK).json({success: "Team updated successfully", team});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not update team at this time`});
  }
};

export const removeTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  // check if it exists
  const itFound = await retrieveTeam(id);;
  if (!itFound) {
    return res.status(StatusCodes.CONFLICT).json({message: "Team does not exist",});
  }
  await deleteTeam(id);
  return res.status(StatusCodes.OK).json({message: "Team deleted successfully"});
};
