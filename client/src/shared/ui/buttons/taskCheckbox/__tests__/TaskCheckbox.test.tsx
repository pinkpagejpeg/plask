import { render, screen } from '@testing-library/react'
import { TaskCheckbox } from "../TaskCheckbox"

describe('TaskCheckbox tests', () => {
  test('Change task status', async () => {
    render(
      <TaskCheckbox
        label='Test'
        checked={false}
        taskId={1}
        allowEdit={true}
      />
    )
    const checkbox = screen.getByTestId('taskCheckbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
    // fireEvent.click(checkbox)
    // expect(screen.getByTestId('taskCheckbox')).toBeChecked()
  })
})