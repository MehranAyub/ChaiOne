import React from 'react';
import '@testing-library/jest-dom'
import formatDate from '../../utils/FormatDate';

describe('Test FormatDate Function', () => {
    it('should format any other date correctly - today disabled', () => {
        // Arrange
        const yesterday = new Date("Mon Mar 07 2021 12:33:43 GMT-0600 (Central Standard Time)").toString();
        
        // Act
        const result = formatDate(yesterday);

        // Assert
        // @ts-ignore
        expect(result.day).toEqual("07");
        // @ts-ignore
        expect(result.m).toEqual("Mar");
        // @ts-ignore
        expect(result.y).toEqual("2021");
    });

    it('should format today\'s date correctly - today enabled', () => {
        // Arrange
        const today = new Date("Mon Mar 08 2021 12:33:43 GMT-0600 (Central Standard Time)").toString();
        
        // Act
        const result = formatDate(today, today);

        // Assert
        expect(result).toEqual("Today, 12:33 PM");
    });

    it('should format any date correctly - today enabled', () => {
        // Arrange
        const dateString = new Date("Mon Mar 07 2021 12:33:43 GMT-0600 (Central Standard Time)").toString();
        const today = new Date("Mon Mar 08 2021 12:33:43 GMT-0600 (Central Standard Time)").toString();
        // Act
        const result = formatDate(dateString, today);

        // Assert
        expect(result).toEqual("Mar 07");
    });
  

  
      
})

