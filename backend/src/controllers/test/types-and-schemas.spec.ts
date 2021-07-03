import { TEST_TYPE } from '../../constants';
import { isValid, validate } from '../../utils/validate';
import {
  testAnswersSchema,
  testArticleIdSchema,
  TestCreate,
  testCreateSchema,
  testQuestionSchema,
  testSaveSchema,
  testTypeSchema,
  TestUpdate,
  testUpdateSchema,
} from './types-and-schemas';
import joi from 'joi';

describe('test types and schemas', () => {
  describe(`test parts`, () => {
    it(`string articleId is converted to number`, () => {
      const result = validate(testArticleIdSchema, '1');
      expect(typeof result).toEqual(`number`);
    });
    it(`article type should be defined in enum`, () => {
      expect(validate(testTypeSchema, TEST_TYPE.ORDERING)).toBeTruthy();
      expect(() =>
        validate(testTypeSchema, 'SOME NOT DEFINED TYPE'),
      ).toThrowError();
    });
    it(`article question should be a string 3 - 2000 symbols length`, () => {
      expect(validate(testQuestionSchema, 'Some question?')).toBeTruthy();
      expect(() => validate(testQuestionSchema, '?')).toThrowError();
    });
  });

  // describe(`validate answer schemas for each type`, () => {
  //   const answersForTypeSchema = joi.object({
  //     type: testTypeSchema,
  //     answers: testAnswersSchema,
  //   });
  //
  //   it(`should test all possible answers for INPUT answer tests`, () => {
  //     expect(
  //       isValid(answersForTypeSchema, {
  //         type: TEST_TYPE.INPUT,
  //         answers: {
  //           correctAnswer: 'Some answer',
  //         },
  //       } as TestCreate),
  //     ).toBeTruthy();
  //     expect(
  //       isValid(answersForTypeSchema, {
  //         type: TEST_TYPE.INPUT,
  //         answers: [
  //           {
  //             text: 'someText',
  //           },
  //         ],
  //       } as TestCreate),
  //     ).toBeFalsy();
  //   });
  //
  //   describe(`should test all possible answers for SINGLE answer tests`, () => {
  //     it(`type SINGLE should contain 2-100 elements`, () => {
  //       expect(() =>
  //         validate(answersForTypeSchema, {
  //           type: TEST_TYPE.SINGLE,
  //           answers: [
  //             {
  //               text: 'some text',
  //             },
  //           ],
  //         }),
  //       ).toThrowError();
  //
  //       expect(() =>
  //         validate(answersForTypeSchema, {
  //           type: TEST_TYPE.SINGLE,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               isCorrect: true,
  //             },
  //             {
  //               text: 'some text 2',
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeTruthy();
  //     });
  //
  //     it(`type SINGLE should contain only 1 correct answer`, () => {
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.SINGLE,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //             },
  //             {
  //               text: 'some text 2',
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeFalsy();
  //
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.SINGLE,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               isCorrect: true,
  //             },
  //             {
  //               text: 'some text 2',
  //               isCorrect: true,
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeFalsy();
  //
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.SINGLE,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               isCorrect: true,
  //             },
  //             {
  //               text: 'some text 2',
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeTruthy();
  //     });
  //   });
  //
  //   describe(`should test all possible answers for MULTIPLE answer tests`, () => {
  //     it(`type MULTIPLE should contain 2-100 elements`, () => {
  //       expect(() =>
  //         validate(answersForTypeSchema, {
  //           type: TEST_TYPE.MULTIPLE,
  //           answers: [
  //             {
  //               text: 'some text',
  //             },
  //           ],
  //         }),
  //       ).toThrowError();
  //
  //       expect(() =>
  //         validate(answersForTypeSchema, {
  //           type: TEST_TYPE.MULTIPLE,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               isCorrect: true,
  //             },
  //             {
  //               text: 'some text 2',
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeTruthy();
  //     });
  //
  //     it(`type MULTIPLE could contain no correct answer`, () => {
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.MULTIPLE,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //             },
  //             {
  //               text: 'some text 2',
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeTruthy();
  //     });
  //   });
  //
  //   describe(`should test all possible answers for ORDERING answer tests`, () => {
  //     it(`should contain 2-100 elements`, () => {
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.ORDERING,
  //           answers: [
  //             {
  //               text: 'some text',
  //               correctPosition: 1,
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeFalsy();
  //
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.ORDERING,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               correctPosition: 1,
  //             },
  //             {
  //               text: 'some text 2',
  //               correctPosition: 2,
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeTruthy();
  //     });
  //
  //     it(`answers should have positions (1, 2, ..., length)`, () => {
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.ORDERING,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               correctPosition: 1,
  //             },
  //             {
  //               text: 'some text 2',
  //               correctPosition: 2,
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeTruthy();
  //
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.ORDERING,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               correctPosition: 1,
  //             },
  //             {
  //               text: 'some text 2',
  //               correctPosition: 2,
  //             },
  //             {
  //               text: 'some text 3',
  //               correctPosition: 2,
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeFalsy();
  //
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.ORDERING,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               correctPosition: 1,
  //             },
  //             {
  //               text: 'some text 2',
  //               correctPosition: 2,
  //             },
  //             {
  //               text: 'some text 3',
  //               correctPosition: 4,
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeFalsy();
  //
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.ORDERING,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //               correctPosition: 0,
  //             },
  //             {
  //               text: 'some text 2',
  //               correctPosition: 1,
  //             },
  //             {
  //               text: 'some text 3',
  //               correctPosition: 2,
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeFalsy();
  //     });
  //
  //     it(`type MULTIPLE could contain no correct answer`, () => {
  //       expect(
  //         isValid(answersForTypeSchema, {
  //           type: TEST_TYPE.MULTIPLE,
  //           answers: [
  //             {
  //               text: 'some text 1',
  //             },
  //             {
  //               text: 'some text 2',
  //             },
  //           ],
  //         } as TestCreate),
  //       ).toBeTruthy();
  //     });
  //   });
  //
  //   it(`type INPUT should throw an error`, () => {
  //     expect(
  //       isValid(testCreateSchema, {
  //         type: TEST_TYPE.INPUT,
  //         articleId: 1,
  //         question: 'Some question',
  //         answers: {
  //           correctAnswer: 'some text',
  //         },
  //       } as TestCreate),
  //     ).toBeTruthy();
  //   });
  //
  //   it(`article type should be defined in enum`, () => {
  //     expect(validate(testTypeSchema, TEST_TYPE.ORDERING)).toBeTruthy();
  //     expect(() =>
  //       validate(testTypeSchema, 'SOME NOT DEFINED TYPE'),
  //     ).toThrowError();
  //   });
  //
  //   it(`article question should be a string 3 - 2000 symbols length`, () => {
  //     expect(validate(testQuestionSchema, 'Some question?')).toBeTruthy();
  //     expect(() => validate(testQuestionSchema, '?')).toThrowError();
  //   });
  // });
  //
  // describe(`validate test create schemas`, () => {
  //   it(`question is required`, () => {
  //     const commonFields = {
  //       answers: {
  //         correctAnswer: 'correctAnswer',
  //       },
  //       articleId: 1,
  //       type: TEST_TYPE.INPUT,
  //     } as TestCreate;
  //     expect(isValid(testCreateSchema, commonFields)).toBeFalsy();
  //     expect(
  //       isValid(testCreateSchema, {
  //         ...commonFields,
  //         question: 'question',
  //       } as TestCreate),
  //     ).toBeTruthy();
  //   });
  //
  //   it(`articleId is required`, () => {
  //     const commonFields = {
  //       answers: {
  //         correctAnswer: 'correctAnswer',
  //       },
  //       question: 'question',
  //       type: TEST_TYPE.INPUT,
  //     } as TestCreate;
  //     expect(isValid(testCreateSchema, commonFields)).toBeFalsy();
  //     expect(
  //       isValid(testCreateSchema, {
  //         ...commonFields,
  //         articleId: 1,
  //       } as TestCreate),
  //     ).toBeTruthy();
  //   });
  // });
  //
  // describe(`validate test update schemas`, () => {
  //   it(`question is optional`, () => {
  //     const commonFields = {
  //       id: 1,
  //       answers: {
  //         correctAnswer: 'correctAnswer',
  //       },
  //       articleId: 1,
  //       type: TEST_TYPE.INPUT,
  //     } as TestUpdate;
  //     expect(isValid(testUpdateSchema, commonFields)).toBeTruthy();
  //     expect(
  //       isValid(testUpdateSchema, {
  //         ...commonFields,
  //         question: 'question',
  //       } as TestUpdate),
  //     ).toBeTruthy();
  //   });
  //
  //   it(`articleId is optional`, () => {
  //     const commonFields = {
  //       id: 1,
  //       answers: {
  //         correctAnswer: 'correctAnswer',
  //       },
  //       question: 'question',
  //       type: TEST_TYPE.INPUT,
  //     } as TestUpdate;
  //     expect(isValid(testUpdateSchema, commonFields)).toBeTruthy();
  //     expect(
  //       isValid(testUpdateSchema, {
  //         ...commonFields,
  //         articleId: 1,
  //       } as TestUpdate),
  //     ).toBeTruthy();
  //   });
  //
  //   it(`id is required`, () => {
  //     const commonFields = {
  //       answers: {
  //         correctAnswer: 'correctAnswer',
  //       },
  //       question: 'question',
  //       articleId: 1,
  //       type: TEST_TYPE.INPUT,
  //     } as TestUpdate;
  //     expect(isValid(testUpdateSchema, commonFields)).toBeFalsy();
  //     expect(
  //       isValid(testUpdateSchema, {
  //         ...commonFields,
  //         id: 1,
  //       } as TestUpdate),
  //     ).toBeTruthy();
  //   });
  //
  //   it(`type is required`, () => {
  //     const commonFields = {
  //       id: 1,
  //       answers: {
  //         correctAnswer: 'correctAnswer',
  //       },
  //       question: 'question',
  //       articleId: 1,
  //     } as TestUpdate;
  //     expect(isValid(testUpdateSchema, commonFields)).toBeFalsy();
  //     expect(
  //       isValid(testUpdateSchema, {
  //         ...commonFields,
  //         type: TEST_TYPE.INPUT,
  //       } as TestUpdate),
  //     ).toBeTruthy();
  //   });
  // });
});
