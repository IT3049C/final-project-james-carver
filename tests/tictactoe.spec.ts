import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/tictactoe.html'); 
  });

  test('loads initial game state', async ({ page }) => {
    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(9);
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toHaveText('');
    }
    await expect(page.getByText(/Player X's turn/i)).toBeVisible();
  });

  test('ability to interact with game components', async ({ page }) => {
    const cells = page.locator('.cell');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');
  });

  test('ability to reset a game to initial state', async ({ page }) => {
    const cells = page.locator('.cell');
    const resetBtn = page.getByRole('button', { name: /reset game/i });

    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');

    await resetBtn.click();
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toHaveText('');
    }
    await expect(page.getByText(/Player X's turn/i)).toBeVisible();
  });
});
