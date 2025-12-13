import { test, expect } from '@playwright/test';

test.describe('Hub Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/index.html'); // adjust to your dev server
  });

  test('loads the landing page', async ({ page }) => {
    await expect(page).toHaveTitle(/GameHub/i);
    await expect(page.getByText('Player:')).toBeVisible();
  });

  test('lists available games', async ({ page }) => {
    const games = ['Wordle', 'Rock Paper Scissors', 'Tic Tac Toe', 'Memory Cards'];
    for (const game of games) {
      await expect(page.getByRole('link', { name: game })).toBeVisible();
    }
  });

  test('captures a player name', async ({ page }) => {
    const input = page.getByPlaceholder('Type here');
    const saveButton = page.getByRole('button', { name: /save/i });

    await input.fill('Tester');
    await saveButton.click();
    await expect(page.getByText('Tester')).toBeVisible();
  });

  test('navigates from hub into a game page and back', async ({ page }) => {
    const wordleLink = page.getByRole('link', { name: /wordle/i });
    await wordleLink.click();
    await expect(page).toHaveURL(/wordle\.html/);

    await page.goBack();
    await expect(page).toHaveURL(/index\.html/);
  });

  test('player name is displayed on all game pages', async ({ page }) => {
    await page.getByPlaceholder('Type here').fill('Tester');
    await page.getByRole('button', { name: /save/i }).click();

    const games = ['Wordle', 'Rock Paper Scissors', 'Tic Tac Toe', 'Memory Cards'];
    for (const game of games) {
      await page.getByRole('link', { name: game }).click();
      await expect(page.getByText('Tester')).toBeVisible();
      await page.goBack();
    }
  });
});
