// Contains all of the functions for deleting data from the database
// Each function takes a poolConnection and the relevant ID as arguments and returns the number of rows affected

// import { pool } from "mssql";

import pkg from 'mssql';

const { pool } = pkg;


export async function deleteUser(poolConnection, userID) {
    try {
        console.log("Deleting user " + userID + " from database");
        let resultSet = await poolConnection.request().query(`
        BEGIN TRANSACTION;

        -- Start by deleting all of the junction tables that reference something that will be deleted (difficulty, comment)
        
        DELETE FROM [dbo].[Users] WHERE UserID = ${userID};
        DELETE FROM [dbo].[Comments] WHERE UserID = ${userID};
        DELETE FROM [dbo].[Difficulty] WHERE UserID = ${userID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

//!Warning: VERY DANGEROUS FUNCTION -- YOU PROBABLY DON'T WANT TO USE THIS UNLESS YOU'RE USING TEST DATA
export async function deleteUniversity(poolConnection, uniID) {
    try {
        console.log("Deleting University " + uniID + " from database");
        let resultSet = await poolConnection.request().query(`
        BEGIN TRANSACTION;

        -- Start by deleting records from tables that have no referencing foreign keys
        DELETE FROM [dbo].[University] WHERE UniID = ${uniID};
        
        -- Next, delete records from tables that have referencing foreign keys
        DELETE FROM [dbo].[Class_Professors] WHERE ClassID IN (SELECT ClassID FROM [dbo].[Class] WHERE ClassTypeID IN (SELECT ClassTypeID FROM [dbo].[ClassType] WHERE UniID = ${uniID}));
        DELETE FROM [dbo].[Difficulty] WHERE ClassID IN (SELECT ClassID FROM [dbo].[Class] WHERE ClassTypeID IN (SELECT ClassTypeID FROM [dbo].[ClassType] WHERE UniID = ${uniID}));
        DELETE FROM [dbo].[Comments] WHERE ClassID IN (SELECT ClassID FROM [dbo].[Class] WHERE ClassTypeID IN (SELECT ClassTypeID FROM [dbo].[ClassType] WHERE UniID = ${uniID}));
        
        -- Finally, delete from the main tables
        DELETE FROM [dbo].[Professors] WHERE UniID = ${uniID};
        DELETE FROM [dbo].[Class] WHERE ClassID IN (SELECT ClassID FROM [dbo].[Class] WHERE ClassTypeID IN (SELECT ClassTypeID FROM [dbo].[ClassType] WHERE UniID = ${uniID}));
        DELETE FROM [dbo].[ClassType] WHERE UniID = ${uniID};
        DELETE FROM [dbo].[Users] WHERE UniID = ${uniID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function deleteClass(poolConnection, classID) {
    try {
        console.log("Deleting class " + classID + " from database");
        let resultSet = await poolConnection.request().query(`
        BEGIN TRANSACTION;

        -- Start by deleting all of the junction tables that reference something that will be deleted (difficulty, comment)

        DELETE FROM [dbo].[Class_Professors] WHERE ClassID = ${classID};
        
        DELETE FROM [dbo].[Difficulty] WHERE ClassID = ${classID};
        DELETE FROM [dbo].[Comments] WHERE ClassID = ${classID};
        DELETE FROM [dbo].[Class] WHERE ClassID = ${classID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function deleteComment(poolConnection, commentID) {
    try {
        console.log("Deleting comment " + commentID + " from database");
        let resultSet = await poolConnection.request().query(`
        BEGIN TRANSACTION;

        -- Start by deleting all of the junction tables that reference something that will be deleted (difficulty, comment)
        DELETE FROM [dbo].[Difficulty] WHERE DifficultyID IN (SELECT DifficultyID FROM [dbo].[Comments] WHERE CommentID = ${commentID});

        DELETE FROM [dbo].[Comments] WHERE CommentID = ${commentID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function deleteProfessor(poolConnection, professorID) {
    try {
        console.log("Deleting professor " + professorID + " from database");
        let resultSet = await poolConnection.request().query(`
        BEGIN TRANSACTION;

        -- Start by deleting all of the junction tables that reference something that will be deleted (difficulty, comment)
        DELETE FROM [dbo].[Class_Professors] WHERE ProfessorID = ${professorID};
        
        DELETE FROM [dbo].[Comments] WHERE DifficultyID IN (SELECT DifficultyID FROM [dbo].[Difficulty] WHERE ProfessorID = ${professorID});
        DELETE FROM [dbo].[Difficulty] WHERE ProfessorID = ${professorID};
        DELETE FROM [dbo].[Professors] WHERE ProfessorID = ${professorID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function deleteClassType(poolConnection, classTypeID) {
    try {
        console.log("Deleting class type " + classTypeID + " from database");
        let resultSet = await poolConnection.request().query(`
        BEGIN TRANSACTION;

        -- Start by deleting all of the junction tables that reference something that will be deleted (difficulty, comment)
        
        DELETE FROM [dbo].[Class_Professors] WHERE ClassID IN (SELECT ClassID FROM [dbo].[Class] WHERE ClassTypeID = ${classTypeID});
        
        DELETE FROM [dbo].[Difficulty] WHERE ClassID IN (SELECT ClassID FROM [dbo].[Class] WHERE ClassTypeID = ${classTypeID});
        DELETE FROM [dbo].[Comments] WHERE ClassID IN (SELECT ClassID FROM [dbo].[Class] WHERE ClassTypeID = ${classTypeID});
        DELETE FROM [dbo].[Class] WHERE ClassTypeID = ${classTypeID};

        DELETE FROM [dbo].[ClassType] WHERE ClassTypeID = ${classTypeID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function deleteDifficulty(poolConnection, difficultyID) {
    try {
        console.log("Deleting difficulty " + difficultyID + " from database");
        let resultSet = await poolConnection.request().query(`
        BEGIN TRANSACTION;

        -- Start by deleting all of the junction tables that reference something that will be deleted (difficulty, comment)
        DELETE FROM [dbo].[Comments] WHERE DifficultyID = ${difficultyID};
        DELETE FROM [dbo].[Difficulty] WHERE DifficultyID = ${difficultyID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}


export async function deleteRequest(poolConnection, requestID) {
    try {
        console.log("deleting request " + requestID + " from database");
        let resultSet = await  poolConnection.request().query(`
        BEGIN TRANSACTION;
        
        DELETE FROM [dbo].[requests] WHERE requestID = ${requestID};
        
        COMMIT;
        `);
        console.log("Number of rows affected: " + resultSet.rowsAffected.reduce((a, b) => a + b, 0));
        return resultSet.rowsAffected.reduce((a, b) => a + b, 0);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}