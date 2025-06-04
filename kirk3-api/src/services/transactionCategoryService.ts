import { TransactionCategory } from "../interfaces/TransactionCategoryInterface";
import { TransactionCategoryModel } from "../models/TransactionCategoryModel";


const getTransactionCategoryFromModel = (transactionCategoryModel: any) => {
  const { id, name, description, code, } = transactionCategoryModel

  const transactionCategory: TransactionCategory = {
    id: id.toString(),
    name,
    description,
    code,
  }
  return transactionCategory;
}

export const createTransactionCategory = async (name: string, description: string, code: string,)
  : Promise<TransactionCategory|null> => {
  const transactionCategory = await TransactionCategoryModel.create({
    name,
    description,
    code,
  });

  return transactionCategory ? getTransactionCategoryFromModel(transactionCategory) : null;
}

export const retrieveTransactionCategories = async (
) : Promise<TransactionCategory[] | null> => {
  const transactionCategories: TransactionCategory[] = [];
  const transactionCategoryModels = await TransactionCategoryModel.find({});
  
  if (transactionCategoryModels && transactionCategoryModels.length) {
    for (let i = 0; i < transactionCategoryModels.length; i++) {
      transactionCategories.push(getTransactionCategoryFromModel(transactionCategoryModels[i]));
    }
  }
  return transactionCategories;
}

export const retrieveTransactionCategory = async (id: string
) : Promise<TransactionCategory | null> => {
  const transactionCategory = await TransactionCategoryModel.findById(id);
  return transactionCategory ? getTransactionCategoryFromModel(transactionCategory) : null;
}

export const retrieveTransactionCategoryByCode = async (code: string
) : Promise<TransactionCategory | null> => {
  const transactionCategory = await TransactionCategoryModel.findOne({
    where: { code: code }
  });
  return transactionCategory ? getTransactionCategoryFromModel(transactionCategory) : null;
}

export const updateTransactionCategory = async (id: string, fieldsToUpdate: any
) : Promise<TransactionCategory | null> => {
    const transactionCategory = await TransactionCategoryModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
    return transactionCategory ? getTransactionCategoryFromModel(transactionCategory) : null ;
}

export const deleteTransactionCategory = async (id: string,) : Promise<void> => {
  await TransactionCategoryModel.findByIdAndDelete(id);
}
