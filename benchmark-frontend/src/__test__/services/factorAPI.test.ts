import React from 'react';
import '@testing-library/jest-dom'
import { getFactors } from '../../services/factorsAPI';

describe('Test Prject APIs', () => {

    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks();
    });

    it('test getFactors()', async () => {
        // Arrange
        const data = [
            {
                "id": "3f95594f-5bc1-479b-8430-b710fbb89c94",
                "name": "Process"
            },
            {
                "id": "fe2b8da8-f4e4-4a1d-8c07-ca9864bc729b",
                "name": "Usability"
            }
        ];

        // @ts-ignore
        fetch.mockResponseOnce(JSON.stringify(data));

        // Act
        const result = await getFactors();

        // Assert
        expect(result).toEqual(data)
    });

})

