//create any query functions here

// Returns all universities in the database
export async function getUniversities(poolConnection) {
    try {
        //console.log("requesting all Universities")
        let resultSet = await poolConnection.request().query("SELECT * FROM [dbo].[University]");
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// given a certain class, returns all data necessary for that class
// this involves getting all comments and difficulties for that class
export async function getClassInfo(poolConnection, classID, uniID) {
    try {
        console.log("requesting class info for classID " + classID + " at university " + uniID);
        let resultSet = await poolConnection.request().query(`
        WITH 
            fullclassname (ClassID, ClassType, ClassName, ClassNum, UniName, UniID) AS (
                SELECT c.ClassID, ct.ClassType, c.ClassName, c.ClassNum, u.UniName, u.UniID
                FROM ClassType ct
                LEFT JOIN Class c ON c.ClassTypeID = ct.ClassTypeID
                LEFT JOIN University u ON ct.UniID = u.UniID
            ),
            fulldiffname (DifficultyID, DifficultyValue, QualityValue, ProfessorName, UserID, ClassID, Email) AS (
                SELECT d.DifficultyID, d.DifficultyValue, d.QualityValue, p.Name, u.UserID, d.ClassID, u.Email
                FROM Difficulty d
                LEFT JOIN Professors p ON d.ProfessorID = p.ProfessorID
                LEFT JOIN Users u ON d.UserID = u.UserID
            )

        SELECT d.DifficultyValue, d.QualityValue, d.ProfessorName, d.Email, c.Comment, c.TermTaken, c.Grade, c.PostDate, cl.ClassType, cl.ClassName, cl.ClassNum, cl.UniName
        FROM fulldiffname d
        LEFT JOIN Comments c ON d.DifficultyID = c.DifficultyID
        LEFT JOIN fullclassname cl ON d.ClassID = cl.ClassID
        WHERE d.ClassID = ${classID} AND cl.UniID = '${uniID}'
        ORDER BY c.PostDate DESC
        `); // Comments are ordered by most recent, descending
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// Gets all the information about the ratings for aggregate data
export async function getClassRatings(poolConnection, classID, uniID) {
    try {
        console.log("requesting class info for classID " + classID + " at university " + uniID);
        let resultSet = await poolConnection.request().query(`
        WITH 
            fullclassname (ClassID, ClassType, ClassName, ClassNum, UniName, UniID) AS (
                SELECT c.ClassID, ct.ClassType, c.ClassName, c.ClassNum, u.UniName, u.UniID
                FROM ClassType ct
                LEFT JOIN Class c ON c.ClassTypeID = ct.ClassTypeID
                LEFT JOIN University u ON ct.UniID = u.UniID
            ),
            fulldiffname (DifficultyID, DifficultyValue, QualityValue, ProfessorName, UserID, ClassID, Email) AS (
                SELECT d.DifficultyID, d.DifficultyValue, d.QualityValue, p.Name, u.UserID, d.ClassID, u.Email
                FROM Difficulty d
                LEFT JOIN Professors p ON d.ProfessorID = p.ProfessorID
                LEFT JOIN Users u ON d.UserID = u.UserID
            )

        SELECT d.DifficultyValue, d.QualityValue
        FROM fulldiffname d
        LEFT JOIN Comments c ON d.DifficultyID = c.DifficultyID
        LEFT JOIN fullclassname cl ON d.ClassID = cl.ClassID
        WHERE d.ClassID = ${classID} AND cl.UniID = '${uniID}'
        ORDER BY c.PostDate DESC
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// Name says it all
export async function getAllClassesByUni(poolConnection, uniID) {
    try {
        console.log("requesting all classes at university " + uniID);
        let resultSet = await poolConnection.request().query(`
        SELECT c.ClassID, ct.ClassType, c.ClassNum, c.ClassName, CONCAT(ct.ClassType, ' ', c.ClassNum, ': ', c.ClassName) AS FullName
        FROM [dbo].[Class] c
        INNER JOIN [dbo].[ClassType] ct ON c.ClassTypeID = ct.ClassTypeID
        WHERE ct.UniID = ${uniID}
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}


// Name also says it all
export async function getClassesByUniAndType(poolConnection, uniID, classTypeID) {
    try {
        console.log("requesting class info for classTypeID " + classTypeID + " at university " + uniID);
        let resultSet = await poolConnection.request().query(`
        SELECT ct.ClassType, c.ClassNum, c.ClassName
        FROM [dbo].[ClassType] ct
        INNER JOIN [dbo].[Class] c ON c.ClassTypeID = ct.ClassTypeID
        WHERE ct.UniID = ${uniID} AND ct.ClassTypeID = ${classTypeID}
        ORDER BY ct.ClassType, c.ClassNum
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// Find all professors, given a university
export async function getProfessorsAtUni(poolConnection, uniID) {
    try {
        console.log("requesting all professors at university " + uniID);
        let resultSet = await poolConnection.request().query(`
        SELECT p.ProfessorID, p.Name
        FROM [dbo].[Professors] p
        WHERE p.UniID = ${uniID}
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}


// Find all classes that a professor teaches
export async function getProfessorsByClassID(poolConnection, classID) {
    try {
        console.log("requesting all professors with classID " + classID);
        let resultSet = await poolConnection.request().query(`
        WITH ProfessorIDS AS (
            SELECT ProfessorID
            FROM [dbo].[Class_Professors]
            WHERE ClassID = ${classID}
        ) 
        
        SELECT p.ProfessorID, p.Name
        FROM [dbo].[Professors] p
        INNER JOIN ProfessorIDS pi on p.ProfessorID = pi.ProfessorID
        
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }

}

//Grab a list of all people who made a post for that class
export async function getPostersByClassID(poolConnection, classID) {
    try {
        console.log("requesting all posters with classID " + classID);
        let resultSet = await poolConnection.request().query(`
        SELECT u.UserID, u.Email
        FROM [dbo].[Difficulty] d
        INNER JOIN [dbo].[Users] u ON d.UserID = u.UserID
        WHERE d.ClassID = ${classID}
        `);
        return resultSet.recordset;
    }
    catch (err) {
        console.error(err.message);
        return null;
    }
}

// Get user id by email
export async function getUserID(poolConnection, email) {
    try {
        console.log("requesting userID for email " + email);
        let resultSet = await poolConnection.request().query(`
        SELECT UserID, Email
        FROM [dbo].[Users]
        WHERE Email = '${email}'
        `);
        return resultSet.recordset;
    }
    catch (err) {
        console.error(err.message);
        return null;
    }
}