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

function destroyDatabase() {
  fs.unlink('db.sqlite3', (err) => {
    console.log("Unable to delete db");
    console.log(err);
  });
}

beforeEach(() => {
  initialiseDatabase();
});

afterEach(() => {
  destroyDatabase();
});


describe('Test that functions in DataService exist', () => {
  test('getId() function exists', () => {
    expect(typeof dataService.getId).toEqual('function');
  });
  
  test('getNickname() function exists', () => {
    expect(typeof dataService.getNickname).toEqual('function');
  });
  
  test('getBlockedUsers() function exists', () => {
    expect(typeof dataService.getBlockedUsers).toEqual('function');
  });
  
  test('getMessages() function exists', () => {
    expect(typeof dataService.getMessages).toEqual('function');
  });
  
  test('storeMessage() function exists', () => {
    expect(typeof dataService.storeMessage).toEqual('function');
  });
});

test('getId()', () => {
  expect(true).toEqual(true); // TODO: DataService needs to implement getID();
});