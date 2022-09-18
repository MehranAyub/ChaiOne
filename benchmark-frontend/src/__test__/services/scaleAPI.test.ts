import React from 'react';
import '@testing-library/jest-dom'
import {getScales} from '../../services/scalesAPI';

describe('Test Prject APIs', () => {

    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks();
    });

    it('test getScales()', async () => {
        // Arrange
        const data = [
            {
              "id": "3f95594f-5bc1-479b-8430-b710fbb89c94",
              "name": "Hours/Year"
            },
            {
              "id": "fe2b8da8-f4e4-4a1d-8c07-ca9864bc729b",
              "name": "Emails/Week"
            }
          ];

         // @ts-ignore
        fetch.mockResponseOnce(JSON.stringify(data));

        // Act
        const result = await getScales();

        // Assert
        expect(result).toEqual(data)
    });
      
})

