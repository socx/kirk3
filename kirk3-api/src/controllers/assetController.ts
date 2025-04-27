import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Asset } from '../interfaces/assetInterfaces';
import { getAssetById, getUserAssets, insertAsset, updateAsset } from '../services/assetService';
import { getUserFromToken } from '../services/userServices';

export const createAsset = async (req: Request, res: Response) => {

  const { 
    type,
    acquisitionDate,
    acquisitionPrice,
    address,
    marketValue,
    minimumEquity,
    financeOutstanding,
    financeProvider,
    investment,
    periodicIncome,
    shareholders,
    users,
  } = req.body;
    
  // call asset service
  const asset: Asset = {
    type,
    acquisitionDate,
    acquisitionPrice,
    address,
    financeOutstanding,
    financeProvider,
    investment,
    marketValue,
    minimumEquity,
    periodicIncome,
    shareholders,
    users,
  };
  const savedAsset = await insertAsset(asset);
  if (savedAsset) {
    // TODO call email service to alert of creation of new asset.
    return res.status(StatusCodes.OK).json({message: 'Asset saved successfully', savedAsset});
  }
  return res.status(StatusCodes.CREATED).json({message: `Could not save asset...`});
};

export const linkUserAssets = async (req: Request, res: Response) => {
  const { assetIds } = req.body;

  const user = await getUserFromToken(req);
  if (user && user.id) {
    // get all the assets
    const linkedAssets: string[] = [];
    for (let i = 0; i < assetIds.length; i++) {
      let asset = await getAssetById(assetIds[i]);
      if (asset) {
        const users: string[] = asset.users ? [...asset.users] : [];
        users.push(user.id);
        const linkedAsset = await updateAsset(asset.id as string, { users });
        if (linkedAsset && linkedAsset.id) {
          linkedAssets.push(linkedAsset.id);
        }
      }
    }
    
    return linkedAssets.length > 0 ?
      res.status(StatusCodes.OK).json({message: `User linked to (${linkedAssets.length}) assets successfully`, linkedAssets}) :
      res.status(StatusCodes.OK).json({message: 'Assets ids not returned'});
  }
  return res.status(StatusCodes.BAD_REQUEST);
}

export const getLinkedUserAssets = async  (req: Request, res: Response) => {
  const user = await getUserFromToken(req);
  if (user && user.id) {
    const assets = await getUserAssets(user.id);
    return res.status(StatusCodes.OK).json({ message: 'Found user assets successfully', assets });
  }
  return res.status(StatusCodes.UNAUTHORIZED);
}
