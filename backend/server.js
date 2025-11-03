const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

var cardList =
    [
        'Roy Campanella',
        'Paul Molitor',
        'Tony Gwynn',
        'Dennis Eckersley',
        'Reggie Jackson',
        'Gaylord Perry',
        'Buck Leonard',
        'Rollie Fingers',
        'Charlie Gehringer',
        'Wade Boggs',
        'Carl Hubbell',
        'Dave Winfield',
        'Jackie Robinson',
        'Ken Griffey, Jr.',
        'Al Simmons',
        'Chuck Klein',
        'Mel Ott',
        'Mark McGwire',
        'Nolan Ryan',
        'Ralph Kiner',
        'Yogi Berra',
        'Goose Goslin',
        'Greg Maddux',
        'Frankie Frisch',
        'Ernie Banks',
        'Ozzie Smith',
        'Hank Greenberg',
        'Kirby Puckett',
        'Bob Feller',
        'Dizzy Dean',
        'Joe Jackson',
        'Sam Crawford',
        'Barry Bonds',
        'Duke Snider',
        'George Sisler',
        'Ed Walsh',
        'Tom Seaver',
        'Willie Stargell',
        'Bob Gibson',
        'Brooks Robinson',
        'Steve Carlton',
        'Joe Medwick',
        'Nap Lajoie',
        'Cal Ripken, Jr.',
        'Mike Schmidt',
        'Eddie Murray',
        'Tris Speaker',
        'Al Kaline',
        'Sandy Koufax',
        'Willie Keeler',
        'Pete Rose',
        'Robin Roberts',
        'Eddie Collins',
        'Lefty Gomez',
        'Lefty Grove',
        'Carl Yastrzemski',
        'Frank Robinson',
        'Juan Marichal',
        'Warren Spahn',
        'Pie Traynor',
        'Roberto Clemente',
        'Harmon Killebrew',
        'Satchel Paige',
        'Eddie Plank',
        'Josh Gibson',
        'Oscar Charleston',
        'Mickey Mantle',
        'Cool Papa Bell',
        'Johnny Bench',
        'Mickey Cochrane',
        'Jimmie Foxx',
        'Jim Palmer',
        'Cy Young',
        'Eddie Mathews',
        'Honus Wagner',
        'Paul Waner',
        'Grover Alexander',
        'Rod Carew',
        'Joe DiMaggio',
        'Joe Morgan',
        'Stan Musial',
        'Bill Terry',
        'Rogers Hornsby',
        'Lou Brock',
        'Ted Williams',
        'Bill Dickey',
        'Christy Mathewson',
        'Willie McCovey',
        'Lou Gehrig',
        'George Brett',
        'Hank Aaron',
        'Harry Heilmann',
        'Walter Johnson',
        'Roger Clemens',
        'Ty Cobb',
        'Whitey Ford',
        'Willie Mays',
        'Rickey Henderson',
        'Babe Ruth'
    ];

// In-memory storage for testing
let users = [
    { UserID: 1, Email: 'test@test.com', Password: 'test', FirstName: 'Test', LastName: 'User' },
    { UserID: 2, Email: 'admin@admin.com', Password: 'admin', FirstName: 'Admin', LastName: 'User' }
];

let cards = [];
let nextUserId = 3; // For in-memory user ID generation

require('dotenv').config();

// MongoDB connection
const url = process.env.MONGODB_URL;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);

let db;

// Connect to MongoDB
async function connectDB() {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', url ? url.replace(/:[^:@]+@/, ':****@') : 'MISSING');
    
    try {
        await client.connect();
        console.log('✓ MongoDB client connected');
        
        db = client.db('LargeProject');
        console.log('✓ Database selected: LargeProject');
        
        // Verify connection by pinging
        await db.command({ ping: 1 });
        console.log('✓ Database ping successful');
        
        // List collections to verify database access
        const collections = await db.listCollections().toArray();
        console.log('✓ Available collections:', collections.map(c => c.name).join(', ') || 'none');
        
        // Count documents
        const userCount = await db.collection('Users').countDocuments();
        const cardCount = await db.collection('Cards').countDocuments();
        console.log(`✓ Users: ${userCount}, Cards: ${cardCount}`);
        
    } catch (error) {
        console.error('✗ MongoDB connection error:');
        console.error('  Error type:', error.name);
        console.error('  Error message:', error.message);
        console.error('  Full error:', error);
        console.log('✗ Falling back to in-memory storage');
        db = null;
    }
}

connectDB();

// TEST ENDPOINT - Add this to check MongoDB connection status
app.get('/api/test-db', async (req, res) => {
    if (!db) {
        return res.json({ 
            status: 'disconnected', 
            message: 'Not connected to MongoDB',
            usingInMemory: true 
        });
    }
    
    try {
        // Test database connection
        await db.command({ ping: 1 });
        
        // Count documents in collections
        const userCount = await db.collection('Users').countDocuments();
        const cardCount = await db.collection('Cards').countDocuments();
        
        // List all collections
        const collections = await db.listCollections().toArray();
        
        res.json({
            status: 'connected',
            database: 'LargeProject',
            collections: collections.map(c => c.name),
            userCount: userCount,
            cardCount: cardCount,
            message: 'MongoDB connection is working!'
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
});

app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, card
    // outgoing: error

    const { userId, card } = req.body;

    const newCard = { Card: card, UserId: userId };
    var error = '';

    try {
        if (db) {
            // Use MongoDB
            await db.collection('Cards').insertOne(newCard);
        } else {
            // Fallback to in-memory storage
            cards.push(newCard);
            cardList.push(card);
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    // incoming: email, password
    // outgoing: id, firstName, lastName, error

    var error = '';

    const { email, password } = req.body;

    // Trim whitespace from inputs
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    let results;
    
    try {
        if (db) {
            // Use MongoDB with case-insensitive email search
            results = await db.collection('Users').find({ 
                Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') }, 
                Password: trimmedPassword 
            }).toArray();
            
            // Debug logging
            console.log('Login attempt:', { email: trimmedEmail, passwordLength: trimmedPassword?.length });
            console.log('Results found:', results.length);
            
            if (results.length === 0) {
                // Try to find user by email only to see if email exists
                const userCheck = await db.collection('Users').findOne({ 
                    Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } 
                });
                console.log('User exists:', !!userCheck);
                if (userCheck) {
                    console.log('Password match:', userCheck.Password === trimmedPassword);
                }
            } else {
                console.log('Raw user data from DB:', results[0]);
                console.log('User found:', { UserID: results[0].UserID, FirstName: results[0].FirstName, LastName: results[0].LastName });
            }
        } else {
            // Fallback to in-memory users
            results = users.filter(user => 
                user.Email.toLowerCase() === trimmedEmail && 
                user.Password === trimmedPassword
            );
        }
    } catch (e) {
        error = e.toString();
        console.error('Login error:', error);
        results = [];
    }

    var id = -1;
    var fn = '';
    var ln = '';

    if (results.length > 0) {
        // Handle both UserID and _id fields, convert to number
        id = results[0].UserID || results[0].userId || results[0]._id;
        // Ensure id is a number
        if (typeof id === 'string') {
            id = parseInt(id, 10);
        }
        // If still not a valid number, use the MongoDB _id as string
        if (isNaN(id) || !id) {
            id = results[0]._id ? results[0]._id.toString() : -1;
        }
        fn = results[0].FirstName || '';
        ln = results[0].LastName || '';
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: error };
    console.log('Login response:', ret);
    res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) => {
    // incoming: firstName, lastName, email, password
    // outgoing: error

    var error = '';

    const { firstName, lastName, email, password } = req.body;

    // Trim inputs
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    // Validation
    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        if (db) {
            // Check if email already exists in MongoDB (case-insensitive)
            const existingUser = await db.collection('Users').findOne({ 
                Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } 
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Get the next UserID - ensure it's a number
            const lastUser = await db.collection('Users').find().sort({ UserID: -1 }).limit(1).toArray();
            let newUserId = 1;
            if (lastUser.length > 0 && lastUser[0].UserID) {
                newUserId = parseInt(lastUser[0].UserID, 10) + 1;
                // If lastUser UserID is NaN, start from 1
                if (isNaN(newUserId)) {
                    const allUsers = await db.collection('Users').find().toArray();
                    newUserId = allUsers.length + 1;
                }
            }

            // Create new user - ensure UserID is a number
            const newUser = {
                UserID: Number(newUserId),
                FirstName: trimmedFirstName,
                LastName: trimmedLastName,
                Email: trimmedEmail,
                Password: trimmedPassword
            };

            console.log('Creating user with UserID:', newUserId, 'Type:', typeof newUserId);
            await db.collection('Users').insertOne(newUser);
            console.log('User registered:', { email: trimmedEmail, userId: newUserId });
        } else {
            // Check if email already exists in in-memory storage
            const existingUser = users.find(user => user.Email.toLowerCase() === trimmedEmail);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Create new user in memory
            const newUser = {
                UserID: nextUserId++,
                FirstName: trimmedFirstName,
                LastName: trimmedLastName,
                Email: trimmedEmail,
                Password: trimmedPassword
            };

            users.push(newUser);
        }
    } catch (e) {
        error = e.toString();
        console.error('Registration error:', error);
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error

    var error = '';

    const { userId, search } = req.body;

    var _search = search.trim();

    var _ret = [];

    try {
        if (db) {
            // Use MongoDB
            const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*', $options: 'i' } }).toArray();
            for (var i = 0; i < results.length; i++) {
                _ret.push(results[i].Card);
            }
        } else {
            // Fallback to in-memory storage
            const results = cards.filter(card =>
                card.Card.toLowerCase().includes(_search.toLowerCase())
            );

            // Also search the initial cardList
            const cardListResults = cardList.filter(card =>
                card.toLowerCase().includes(_search.toLowerCase())
            );

            // Add results from cards array
            for (var i = 0; i < results.length; i++) {
                _ret.push(results[i].Card);
            }

            // Add results from cardList (avoiding duplicates)
            for (var i = 0; i < cardListResults.length; i++) {
                if (!_ret.includes(cardListResults[i])) {
                    _ret.push(cardListResults[i]);
                }
            }
        }
    } catch (e) {
        error = e.toString();
    }

    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

app.post('/api/completechallenge', async (req, res, next) => {
    // incoming: userId, challengeId, date, attempts, score
    // outgoing: error

    var error = '';
    const { userId, challengeId, date, attempts, score } = req.body;

    // Convert userId to number for consistency
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const completion = { 
        UserId: userIdNum, 
        ChallengeId: challengeId, 
        Date: date,
        Attempts: attempts || 1,
        Score: score || 0,
        CompletedAt: new Date()
    };

    try {
        if (db) {
            // Check if already completed today
            const existing = await db.collection('Completions').findOne({
                UserId: { $in: [userId, userIdNum] },
                Date: date
            });

            if (existing) {
                console.log('Challenge already completed today for user:', userId);
                return res.status(400).json({ error: 'Challenge already completed today' });
            }

            // Use MongoDB
            await db.collection('Completions').insertOne(completion);
            console.log('Challenge completion saved:', completion);
        } else {
            // For in-memory, we don't need to store this
            console.log('Challenge completed (in-memory):', completion);
        }
    } catch (e) {
        error = e.toString();
        console.error('Error saving completion:', error);
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/recordattempt', async (req, res, next) => {
    // incoming: userId, challengeId, date, attemptNumber, passed
    // outgoing: error

    var error = '';
    const { userId, challengeId, date, attemptNumber, passed } = req.body;

    // Convert userId to number for consistency
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const attempt = {
        UserId: userIdNum,
        ChallengeId: challengeId,
        Date: date,
        AttemptNumber: attemptNumber,
        Passed: passed,
        Timestamp: new Date()
    };

    try {
        if (db) {
            await db.collection('Attempts').insertOne(attempt);
            console.log('Attempt recorded:', attempt);
        } else {
            console.log('Attempt recorded (in-memory):', attempt);
        }
    } catch (e) {
        error = e.toString();
        console.error('Error recording attempt:', error);
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.get('/api/gettodayattempts/:userId/:date', async (req, res, next) => {
    // Get number of attempts for today's challenge
    var error = '';
    const { userId, date } = req.params;

    try {
        if (db) {
            // Convert userId to number for consistency
            const userIdNum = parseInt(userId, 10);
            
            // Check if user completed the challenge today
            const completion = await db.collection('Completions').findOne({
                UserId: { $in: [userId, userIdNum] },
                Date: date
            });

            // If completed, return the stored attempt count from completion record
            if (completion) {
                console.log('User completed challenge. Attempts from completion:', completion.Attempts);
                res.status(200).json({ 
                    attempts: completion.Attempts || 1,
                    completed: true,
                    score: completion.Score || 0,
                    error: '' 
                });
                return;
            }

            // Otherwise, check the attempts collection
            const attempts = await db.collection('Attempts').find({
                UserId: { $in: [userId, userIdNum] },
                Date: date
            }).toArray();

            console.log('Checking attempts for user:', userId, 'date:', date);
            console.log('Found attempts:', attempts.length);

            res.status(200).json({ 
                attempts: attempts.length,
                completed: false,
                error: '' 
            });
        } else {
            res.status(200).json({ attempts: 0, completed: false, error: '' });
        }
    } catch (e) {
        error = e.toString();
        console.error('Error in gettodayattempts:', error);
        res.status(500).json({ attempts: 0, completed: false, error: error });
    }
});

app.get('/api/leaderboard/score', async (req, res, next) => {
    // Get leaderboard by total score
    var error = '';

    try {
        if (db) {
            const leaderboard = await db.collection('Completions').aggregate([
                {
                    $group: {
                        _id: '$UserId',
                        totalScore: { $sum: '$Score' },
                        totalCompletions: { $count: {} }
                    }
                },
                {
                    $sort: { totalScore: -1 }
                },
                {
                    $limit: 10
                }
            ]).toArray();

            // Get user details for each entry
            const leaderboardWithUsers = await Promise.all(
                leaderboard.map(async (entry) => {
                    const user = await db.collection('Users').findOne({ 
                        UserID: entry._id 
                    });
                    return {
                        userId: entry._id,
                        firstName: user?.FirstName || 'Unknown',
                        lastName: user?.LastName || 'User',
                        totalScore: entry.totalScore,
                        totalCompletions: entry.totalCompletions
                    };
                })
            );

            res.status(200).json({ leaderboard: leaderboardWithUsers, error: '' });
        } else {
            res.status(200).json({ leaderboard: [], error: '' });
        }
    } catch (e) {
        error = e.toString();
        console.error('Leaderboard error:', error);
        res.status(500).json({ leaderboard: [], error: error });
    }
});

app.get('/api/leaderboard/streak', async (req, res, next) => {
    // Get leaderboard by longest streak
    var error = '';

    try {
        if (db) {
            // Get all completions sorted by user and date
            const allCompletions = await db.collection('Completions').find()
                .sort({ UserId: 1, Date: 1 })
                .toArray();

            // Calculate streaks for each user
            const userStreaks = new Map();

            allCompletions.forEach(completion => {
                if (!userStreaks.has(completion.UserId)) {
                    userStreaks.set(completion.UserId, {
                        currentStreak: 0,
                        longestStreak: 0,
                        lastDate: null,
                        dates: []
                    });
                }

                const userData = userStreaks.get(completion.UserId);
                userData.dates.push(new Date(completion.Date));
            });

            // Calculate streaks
            const streakData = [];
            for (const [userId, data] of userStreaks) {
                let currentStreak = 0;
                let longestStreak = 0;
                let prevDate = null;

                data.dates.sort((a, b) => a - b);

                for (const date of data.dates) {
                    if (prevDate) {
                        const diffDays = Math.floor((date - prevDate) / (1000 * 60 * 60 * 24));
                        if (diffDays === 1) {
                            currentStreak++;
                        } else if (diffDays > 1) {
                            longestStreak = Math.max(longestStreak, currentStreak);
                            currentStreak = 1;
                        }
                    } else {
                        currentStreak = 1;
                    }
                    prevDate = date;
                }
                longestStreak = Math.max(longestStreak, currentStreak);

                const user = await db.collection('Users').findOne({ UserID: userId });
                streakData.push({
                    userId: userId,
                    firstName: user?.FirstName || 'Unknown',
                    lastName: user?.LastName || 'User',
                    longestStreak: longestStreak,
                    currentStreak: currentStreak
                });
            }

            streakData.sort((a, b) => b.longestStreak - a.longestStreak);
            const topStreaks = streakData.slice(0, 10);

            res.status(200).json({ leaderboard: topStreaks, error: '' });
        } else {
            res.status(200).json({ leaderboard: [], error: '' });
        }
    } catch (e) {
        error = e.toString();
        console.error('Streak leaderboard error:', error);
        res.status(500).json({ leaderboard: [], error: error });
    }
});

app.post('/api/updateaccount', async (req, res, next) => {
    // incoming: userId, email (optional), password (optional)
    // outgoing: error

    var error = '';
    const { userId, email, password } = req.body;

    // Validation
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!email && !password) {
        return res.status(400).json({ error: 'At least one field must be provided to update' });
    }

    try {
        if (db) {
            const updateFields = {};
            
            if (email) {
                const trimmedEmail = email.trim().toLowerCase();
                
                // Check if email is already taken by another user
                const existingUser = await db.collection('Users').findOne({
                    Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') },
                    UserID: { $ne: userId }
                });
                
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use by another account' });
                }
                
                updateFields.Email = trimmedEmail;
            }
            
            if (password) {
                updateFields.Password = password.trim();
            }

            // Update user in MongoDB
            const result = await db.collection('Users').updateOne(
                { UserID: userId },
                { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            console.log('Account updated for user:', userId);
        } else {
            // Update in-memory storage
            const userIndex = users.findIndex(u => u.UserID === userId);
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (email) {
                const trimmedEmail = email.trim().toLowerCase();
                
                // Check if email is already taken
                const existingUser = users.find(u => 
                    u.Email.toLowerCase() === trimmedEmail && u.UserID !== userId
                );
                
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use by another account' });
                }
                
                users[userIndex].Email = trimmedEmail;
            }
            
            if (password) {
                users[userIndex].Password = password.trim();
            }
        }
    } catch (e) {
        error = e.toString();
        console.error('Update account error:', error);
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

console.log('Server starting on port 5000...');
console.log('Test credentials: email=test@test.com, password=test');

app.listen(5000); // start Node + Express server on port 5000
