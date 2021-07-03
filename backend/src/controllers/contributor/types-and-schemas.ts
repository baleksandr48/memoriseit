import joi from 'joi';

export interface ContributorCreate {
  email: string;
}

export const contributorCreateSchema = joi.object({
  email: joi
    .string()
    .email()
    .required(),
});
