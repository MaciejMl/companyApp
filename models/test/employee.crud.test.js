const Employee = require('../employees.model');
const Department = require('../departments.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testDepOne = new Department({ name: 'Depot #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Depot #2' });
      await testDepTwo.save();

      const testEmpOne = new Employee({
        firstName: 'EmplName #1',
        lastName: 'EmplLastname #1',
        department: testDepOne._id,
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'EmplName #2',
        lastName: 'EmplLastname #2',
        department: testDepTwo._id,
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return all the data with object "department" with "populate" method', async () => {
      const employees = await Employee.find().populate('department');
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);

      const emplOne = employees[0];
      expect(emplOne.department).to.be.an('object');
      expect(emplOne.department.name).to.be.equal('Depot #1');

      const emplTwo = employees[1];
      expect(emplTwo.department).to.be.an('object');
      expect(emplTwo.department.name).to.be.equal('Depot #2');
    });

    it('should return a proper document by "firstName" with "findOne" method', async () => {
      const employees = await Employee.findOne({ firstName: 'EmplName #1' });
      const expectedName = 'EmplName #1';
      expect(employees.firstName).to.be.equal(expectedName);
    });

    it('should return a proper document by "lastName" with "findOne" method', async () => {
      const employyes = await Employee.findOne({ lastName: 'EmplLastname #2' });
      const expectedName = 'EmplLastname #2';
      expect(employyes.lastName).to.be.equal(expectedName);
    });

    after(async () => {
      await Employee.deleteMany();
    });
    after(async () => {
      await Department.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'EmplName #1',
        lastName: 'EmplLastname #1',
        department: 'Depot #1',
      });
      await employee.save();
      const savedEmployee = await Employee.findOne({
        firstName: 'EmplName #1',
      });
      expect(savedEmployee).to.not.be.null;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testDepOne = new Employee({
        firstName: 'EmplName #1',
        lastName: 'EmplLastname #1',
        department: 'Depot #1',
      });
      await testDepOne.save();

      const testDepTwo = new Employee({
        firstName: 'EmplName #2',
        lastName: 'EmplLastname #2',
        department: 'Depot #2',
      });
      await testDepTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        {
          firstName: 'EmplName #2',
          lastName: 'EmplLastname #2',
          department: 'Depot #2',
        },
        {
          $set: {
            firstName: '=EmplName #2=',
            lastName: '=EmplLastname #2=',
            department: '=Depot #2=',
          },
        }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=EmplName #2=',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employees = await Employee.findOne({ firstName: 'EmplName #2' });
      employees.firstName = '=EmplName #2=';
      employees.lastName = '=EmplLastname #2=';
      employees.department = '=Depot #2=';

      await employees.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=EmplName #2=',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany(
        {},
        {
          $set: {
            firstName: 'Updated!',
            lastName: 'Updated!!',
            department: 'Updated!!!',
          },
        }
      );
      const employees = await Employee.find();
      expect(employees[0].firstName).to.be.equal('Updated!');
      expect(employees[1].firstName).to.be.equal('Updated!');
    });

    it('should properly update multiple documents with "updateMany" method #2', async () => {
      await Employee.updateMany(
        {},
        {
          $set: {
            firstName: 'Updated!',
            lastName: 'Updated!!',
            department: 'Updated!!!',
          },
        }
      );
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testDepOne = new Employee({
        firstName: 'EmplName #1',
        lastName: 'EmplLastname #1',
        department: 'Depot #1',
      });
      await testDepOne.save();

      const testDepTwo = new Employee({
        firstName: 'EmplName #2',
        lastName: 'EmplLastname #2',
        department: 'Depot #2',
      });
      await testDepTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'EmplName #1' });
      const removedEmployee = await Employee.findOne({
        firstName: 'EmplName #1',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'EmplName #1' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        firstName: 'EmplName #1',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const removedEmployee = await Employee.find();
      expect(removedEmployee.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});
