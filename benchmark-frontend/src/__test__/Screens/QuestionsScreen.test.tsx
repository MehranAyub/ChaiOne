import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import QuestionsScreen from '../../screens/QuestionsScreen';



describe('Question Screen', () => {

    beforeEach(() => {

        // @ts-ignore
        fetch.resetMocks();
    });

    const pendingSurvey = {
        id: 300561535,
        title: "ChaiOne Website - Benchmark Survey",
        status: 1,
        responseCount: 2
    }


    it('should render Surveys header', () => {
        render(<BrowserRouter> <QuestionsScreen importedSurvey={pendingSurvey} /></BrowserRouter>);
        expect(screen.getByText('Question')).toBeInTheDocument();
        expect(screen.getByText('Responses')).toBeInTheDocument();
        expect(screen.getByText('Scale')).toBeInTheDocument();
    });


    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <QuestionsScreen importedSurvey={pendingSurvey} />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();

    });

})