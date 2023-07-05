import Company from "../../models/Company.js";
import { v4 as uuidv4 } from "uuid";

const Companies = async (_, { filters = {} }) => {
    try {
        let query = {};
        const { _id } = filters
        if (_id) {
            query = { _id }
        }
        const companies = await Company.aggregate([])
            .match(query)

            .addFields({
                nameLower: { $toLower: "$name" } // Agregar campo con nombre en minúscula
            })
            .sort({ nameLower: 1 })
        return companies;
    } catch (error) {
        return error;
    }
};

const Company_register = async (_, { companyData = {} }) => {
    try {
        const { name, passwords, address, email, } = companyData;
        const company = new Company({
            _id: uuidv4(),
            name,
            passwords,
            address,
            email
        });
        await company.save();
        return true;
    } catch (error) {
        return error;
    }
};
const Company_update = async (_, { companyData = {}, _id }) => {
    try {
        await Company.findByIdAndUpdate(_id, companyData, {
            new: true,
        });
        return true;
    } catch (error) {
        return error;
    }
};
const Company_save = async (_, { companyData = {} }) => {
    try {
        const isCompanyFound = await Company.find()

        if (isCompanyFound.length === 0) {
            return await Company_register(_, { companyData });
        } else {
            const _id = isCompanyFound[0]._id
            return await Company_update(_, { companyData, _id });
        }
    } catch (error) {
        return error;
    }
};
const Company_delete = async (_, { _id }) => {
    try {
        await Company.findOneAndDelete({ _id });
        return true;
    } catch (error) {
        return error;
    }
};

export const companyResolvers = {
    Query: {
        Companies,
    },
    Mutation: {
        Company_delete,
        Company_save,
    },
};
