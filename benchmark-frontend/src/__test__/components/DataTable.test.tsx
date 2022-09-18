import React from 'react';
import '@testing-library/jest-dom'
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import DataTable from '../../components/DataTable';


// Utils
import formatDate from '../../utils/FormatDate';

describe('Test StatusCell Component', () => {
    it('test Snapshot', () => {
        // Arrange
        const importSurveysAction = jest.fn(() => null);

        const component = renderer.create(
            <BrowserRouter>
                <DataTable 
                name="awaiting import"
                data={[]}
                todayDateObj={formatDate(new Date().toDateString())}
                headers={['Form Name', 'Responses', '']}
                sorting={[]}
                labels={['title', 'responseCount', '']}
                buttons={[2]}
                buttonLabels={['Import', 'Ignore']}
                buttonAction={importSurveysAction}
                formatCells={{}}
                setUpdateQuestions={[]}
                />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})

