/**
 * @jest-environment node
 */
const puppeteer = require('puppeteer');
const full4s = require('@suvelocity/tester');

const path = 'file://' + __dirname + '/src/index.html'
let page;
let browser;

const secondTaskText = 'second task input';
jest.setTimeout(10000);
const projectName = 'pre.Todo App';
describe(projectName, () => {
  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    await page.goto(path, { waitUntil: 'networkidle0' })
    await full4s.beforeAll();
  });
  afterEach(async () => {
    await full4s.afterEach(page);
  })
  afterAll(async () => {
    await full4s.afterAll(projectName);
    await browser.close();
  });
  test('The todo list should be empty first', async () => {
    const elements = await page.$$('.todoText');
    expect(elements.length).toBe(0);
  });
  test('Can add todo task with text and priority', async () => {
    const firstTaskText = 'first task input';
    const secondTaskText = 'second task input';
    await page.type('#textInput', firstTaskText);
    await page.select('#prioritySelector', '1');
    await page.click('#addButton');
    const elements = await page.$$('.todoText');
    const firstItem = await (await elements[0].getProperty('innerText')).jsonValue();
    const priorityElements = await page.$$('.todoPriority');
    const firstItemPriority = await (await priorityElements[0].getProperty('innerText')).jsonValue();
    
    expect(elements.length).toBe(1)
    expect(firstItem).toBe(firstTaskText)
    expect(firstItemPriority).toBe('1')
  });
  test('After add task the input should be empty', async () => {

    await page.type('#textInput', secondTaskText);
    await page.select('#prioritySelector', '4');
    await page.click('#addButton');
    const inputElement = await page.$('#textInput');
    const currentInput = await (await inputElement.getProperty('value')).jsonValue();
    expect(currentInput).toBe('')
  });
  test('Task should be added in the end of the list', async () => {
    const elements = await page.$$('.todoText');
    const secondItem = await (await elements[1].getProperty('innerText')).jsonValue();

    const priorityElements = await page.$$('.todoPriority');
    const secondItemPriority = await (await priorityElements[1].getProperty('innerText')).jsonValue();
    expect(secondItem).toBe(secondTaskText)
    expect(secondItemPriority).toBe('4')
  });
  test('Counter increase', async () => {
    const counterElement = await page.$('#counter');
    const currentCounter = await (await counterElement.getProperty('innerText')).jsonValue();
    expect(currentCounter).toBe("2")
  });
  test('Bonus - Can sort by priority', async () => {
    await page.click('#sortButton');
    const elements = await page.$$('.todoText');
    const secondItem = await (await elements[0].getProperty('innerText')).jsonValue();
    const priorityElements = await page.$$('.todoPriority');
    const secondItemPriority = await (await priorityElements[0].getProperty('innerText')).jsonValue();
    expect(secondItem).toBe(secondTaskText)
    expect(secondItemPriority).toBe('4')
  });
})
