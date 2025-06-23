import { Team } from "../interfaces/TeamInterface";
import { TeamModel } from "../models/TeamModel";


const getTeamFromModel = (teamModel: any) => {
  const { id, teamName, } = teamModel

  const team: Team = {
    id: id.toString(),
    teamName,
  }
  return team;
}

export const createTeam = async (teamName: string,)
  : Promise<Team|null> => {
  const team = await TeamModel.create({ teamName });

  return team ? getTeamFromModel(team) : null;
}

export const retrieveTeams = async (
) : Promise<Team[] | null> => {
  const teams: Team[] = [];
  const teamModels = await TeamModel.find({});
  
  if (teamModels && teamModels.length) {
    for (let i = 0; i < teamModels.length; i++) {
      teams.push(getTeamFromModel(teamModels[i]));
    }
  }
  return teams;
}

export const retrieveTeam = async (id: string
) : Promise<Team | null> => {
  const team = await TeamModel.findById(id);
  return team ? getTeamFromModel(team) : null;
}

export const retrieveTeamByName = async (teamName: string
) : Promise<Team | null> => {
  const team = await TeamModel.findOne({
    where: { teamName: teamName }
  });
  return team ? getTeamFromModel(team) : null;
}

export const updateTeam = async (id: string, fieldsToUpdate: any
) : Promise<Team | null> => {
    const team = await TeamModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
    return team ? getTeamFromModel(team) : null ;
}

export const deleteTeam = async (id: string,) : Promise<void> => {
  await TeamModel.findByIdAndDelete(id);
}
