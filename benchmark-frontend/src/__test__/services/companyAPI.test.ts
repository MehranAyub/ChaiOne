import React from 'react';
import '@testing-library/jest-dom'
import {getCompanies, postCompanies} from '../../services/companyAPI';

describe('Test Company APIs', () => {

    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks();
    });

    it('test getCompany()', async () => {
        // Arrange
        const data = [
            {
                "id": "9b02968c-c1b0-4e27-9106-2b4fb93109e7",
                "name": "designThinking",
                "projectId": null
            },
            {
                "id": "61e5c58f-acf5-4f20-8a3d-2d0350f9dd61",
                "name": "test3",
                "projectId": null
            }
        ];

         // @ts-ignore
        fetch.mockResponseOnce(JSON.stringify(data));

        // Act
        const result = await getCompanies();

        // Assert
        expect(result).toEqual(data)
    });

    it('test postCompanies()', async () => {
        // Arrange
        const data:any = [];

         // @ts-ignore
        fetch.mockResponseOnce(JSON.stringify(data));

        // Act
        const result = await postCompanies('a company name');

        // Assert
        expect(result).toEqual(data)

    });

      
})

