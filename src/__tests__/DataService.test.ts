const sqlite3 = require('sqlite3').verbose();
import * as fs from 'fs';
import { Database } from 'sqlite3';
import { DataService } from '../DataService';

process.env.test = "true";
let dataService: DataService = new DataService();
let db: Database;

function initialiseDatabase() {
  db = new sqlite3.Database('db.sqlite3');
}

beforeEach(() => {
  initialiseDatabase();
});

describe('Test that functions in DataService exist', () => {
  test('getId() function exists', () => {
    expect(typeof dataService.getId).toEqual('function');
  });

  test('getPersonalNickname() function exists', () => {
    expect(typeof dataService.getPersonalNickname).toEqual('function');
  });

  test('getMessages() function exists', () => {
    expect(typeof dataService.getMessages).toEqual('function');
  });

  test('storeMessage() function exists', () => {
    expect(typeof dataService.storeMessage).toEqual('function');
  });
});
