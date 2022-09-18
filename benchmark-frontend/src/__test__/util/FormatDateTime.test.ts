import React from 'react';
import '@testing-library/jest-dom'
import formatDateTime from '../../utils/FormatDateTime';

describe('Test FormatDateTime Function', () => {

    it('should format today\'s date correctly', () => {
        // Arrange
        const today = new Date("Mon Mar 08 2021 12:33:43 GMT-0600 (Central Standard Time)").toString();
        
        // Act
        const result = formatDateTime(today);

        // Assert
        expect(result).toEqual("08/03/21, 12:33 PM");
    });


  

  
      
})

