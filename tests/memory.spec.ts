import { test, expect } from '@playwright/test';

test.describe('Memory Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/memory.html'); // adjust to your dev server
  });

  test('loads initial game state', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start game/i })).toBeVisible();
    await expect(page.getByText(/Click Start/i)).toBeVisible();
  });

  test('ability to interact with game components', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /start game/i });
    await startBtn.click();

    const cards = page.locator('.card');
    await expect(cards).toHaveCount(16);

    // Click first card
    await cards.nth(0).click();
    await expect(cards.nth(0)).toHaveClass(/active/);
  });

  test('ability to reset game after game over', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /start game/i });
    await startBtn.click();

    const cards = page.locator('.card');

    // Simulate wrong sequence to end game
    for (let i = 0; i < 16; i++) {
      await cards.nth(i).click();
    }

    await expect(page.getByText(/Game Over!/i)).toBeVisible();
    const playAgainBtn = page.getByRole('button', { name: /play again/i });
    await playAgainBtn.click();

    // Ensure game resets
    await expect(page.getByText(/Click Start/i)).toBeVisible();
  });
});
