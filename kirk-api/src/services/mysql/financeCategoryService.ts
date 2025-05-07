import { FinanceCategory } from '../../interfaces/FinanceCategoryInterface'

import { FinanceCategoryModel } from '../../database/models/FinanceCategoryModel'


const getFinanceCategoryFromModel = (financeCategoryModel: any) => {
  const { id, name, description, code, } = financeCategoryModel

  const financeCategory: FinanceCategory = {
    id: id.toString(),
    name,
    description,
    code,
  }
  return financeCategory;
}

export const createFinanceCategory = async (name: string, description: string, code: string,)
  : Promise<FinanceCategory|null> => {
  const financeCategory = await FinanceCategoryModel.create({
    name,
    description,
    code,
  });

  return financeCategory ? getFinanceCategoryFromModel(financeCategory) : null;
}

export const retrieveFinanceCategories = async () => {
  const financeCategories: FinanceCategory[] = [];
  const financeCategoryModels = await FinanceCategoryModel.findAll({
    attributes: ['id', 'name', 'description', 'code'],
  });
  
  if (financeCategoryModels && financeCategoryModels.length) {
    for (let i = 0; i < financeCategoryModels.length; i++) {
      financeCategories.push(getFinanceCategoryFromModel(financeCategoryModels[i]));
    }
  }
  return financeCategories;
}

export const retrieveFinanceCategory = async (id: string) => {
  const financeCategory = await FinanceCategoryModel.findByPk(id);
  return financeCategory ? getFinanceCategoryFromModel(financeCategory) : null;
}

export const retrieveFinanceCategoryByCode = async (code: string) => {
  const financeCategory = await FinanceCategoryModel.findOne({
    where: { code: code }
  });
  return financeCategory ? getFinanceCategoryFromModel(financeCategory) : null;
}

export const updateFinanceCategory = async (id: string, fieldsToUpdate: any) => {
  const financeCategory = await FinanceCategoryModel.findByPk(id);
  await financeCategory?.update({...fieldsToUpdate});
  financeCategory?.reload();
  return financeCategory ? getFinanceCategoryFromModel(financeCategory) : null;
}

export const deleteFinanceCategory = async (id: string,) : Promise<void> => {
  const financeCategory = await FinanceCategoryModel.findByPk(id);
  if (financeCategory) {
    await financeCategory.destroy();
  }
}
