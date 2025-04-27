import { Asset } from "../interfaces/assetInterfaces";

import { AssetModel } from "../models/assetModel";


const getAssetFromModel = (assetModel: any) => {
  const {
    _id,
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
    createdAt,
    updatedAt,
    deletedAt
  } = assetModel;
  
  const asset: Asset = {
    id: _id ? _id.toString() : null,
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
    createdAt: createdAt ? createdAt.toISOString() : null,
    updatedAt: updatedAt ? updatedAt.toISOString() : null,
    deletedAt: deletedAt ? deletedAt.toISOString() : null,
  }
  return asset;
}

const getAssetsFromModel = (assetModels: any[]) : Asset[] => {
  const asset: Asset[]  = [];
  assetModels.forEach((assetModel) => {
    asset.push(getAssetFromModel(assetModel))
  });
  return asset;
}

export const insertAsset = async (
    asset: Asset,
  ) : Promise<Asset | null> => {
  const savedAsset = await AssetModel.create({...asset});
  return savedAsset ? getAssetFromModel(savedAsset.toObject()) : null;
}

export const updateAsset = async (
  id: string, fieldsToUpdate: any
) : Promise<Asset | null> => {
  const assetToUpdate = await AssetModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
  return assetToUpdate ? getAssetFromModel(assetToUpdate.toObject()) : null;
}

export const getAssetById = async (_id: string) : Promise<Asset | null> => {
  const assetModel = await AssetModel.findById({_id});
  return assetModel ? getAssetFromModel(assetModel as any) : null;
}

export const getUserAssets = async (userId: string) : Promise<Asset[] | null> => {
  const assetModels = await AssetModel.find({ users: { $in: [userId]} });
  return assetModels && assetModels.length > 0 ? getAssetsFromModel(assetModels) : [];
}
