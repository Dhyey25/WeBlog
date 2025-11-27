const blogs = require("./data.json");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const maxUsersToPush = 200;

function replaceSingleQuotesWithDoubleQuotes(inputString) {
  return inputString.replace(/'/g, '"');
}

function randomInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function convertNumberToId(number, userOrBlog = "user") {
  let startHex = "aaaaaaaaaaaaaaaaaaaaaaaa";
  if (userOrBlog === "blog") {
    startHex = "bbbbbbbbbbbbbbbbbbbbbbbb";
  }
  if (userOrBlog === "comment") {
    startHex = "cccccccccccccccccccccccc";
  }
  return new mongoose.Types.ObjectId(
    startHex.slice(0, 24 - number.toString().length) + number
  );
}

console.log("Generating data...");
let userIdName = new Map();
userIdName.set("Hello", convertNumberToId(1, "user"));
let tags = new Set();

console.time("executionTime");

const filteredBlogs = blogs
  .map((blog, index) => {
    let { title, text, authors, timestamp, tags: blogTags } = blog;
    
    // Cleaning data logic based on doc description
    let authorArray = replaceSingleQuotesWithDoubleQuotes(authors);
    let tagsArray = replaceSingleQuotesWithDoubleQuotes(blogTags);
    
    // Parsing tags if they are strings in json
    let parsedTags = [];
    try {
        parsedTags = JSON.parse(tagsArray);
    } catch(e) { parsedTags = [] }
    
    parsedTags = parsedTags.map((tag) => tag.toLowerCase());

    const content = JSON.stringify({
      time: 1550476186479,
      blocks: text.split("\n\n").map((paragraph) => ({
        id: faker.string.uuid(),
        type: "paragraph",
        data: {
          text: paragraph.trim(),
        },
      })),
      version: "2.8.1",
    });

    return {
      _id: convertNumberToId(index + 1, "blog"),
      title,
      description: text.slice(0, randomInt(200, 250)),
      content: content,
      img: `https://picsum.photos/id/${randomInt(10, 1000)}/200/300`,
      author: authors[0] || null, // Assuming authors is array or string
      tags: parsedTags,
      views: 0,
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      createdAt: faker.date.past(),
    };
  })
  .filter((blog) => {
    if (!blog.title || blog.title.length < 6) return false;
    
    // Mock logic for author management from the doc
    if (userIdName.size >= maxUsersToPush) {
        let randomAuthor = Array.from(userIdName.values())[randomInt(0, userIdName.size - 1)];
        blog.author = randomAuthor;
    } else {
        // Generate a new ID for this author
        let newId = convertNumberToId(userIdName.size + 1, "user");
        userIdName.set(blog.author, newId); // Mapping placeholder name to ID
        blog.author = newId;
    }
    
    blog.tags.forEach((tag) => tags.add(tag.toLowerCase()));
    return true;
  });

console.timeLog("executionTime", "Filtering blogs");

const tagArray = [...tags];
const randomComments = [
  "I don't agree with this",
  "I agree with this",
  "This is a great article",
  "This is a bad article",
  "This is a great read",
  "I don't understand this",
  "This is too complicated",
  "This is too simple",
  "I don't like this",
  "I like this",
];

const bioData = [
"Passionate about technology and innovation.",
"Enthusiastic learner always seeking to expand my knowledge",
"Experienced in web development with expertise in HTML, CSS.",
"Adept at problem-solving and troubleshooting.",
"Creative thinker with a keen eye for design.",
"Dedicated team player with excellent communication skills.",
"Experienced in Agile methodologies and project management.",
"Driven by a passion for creating meaningful user experience.",
"Constantly exploring new tools and frameworks to enhance development.",
"Fascinated by artificial intelligence and its applications.",
"Strong background in data analysis and visualization.",
"Skilled in utilizing various APIs to integrate third-party services.",
"Passionate advocate for accessibility and inclusive design.",
"Experienced in working with cross-functional teams to deliver at time.", 
"Proactive problem-solver with a knack for finding elegant solution.",
"Detail-oriented with a focus on writing clean, maintainable code.",
"Experienced in optimizing web applications for performance.",
"Passionate about open-source software and contributing towards Change.",
"Adaptable and quick to learn new technologies and methodology.",
"Effective communicator with a knack for simplifying complex code.",
"Driven by a desire to make a positive impact through technology.",
"Experienced in building responsive and mobile-friendly web applications.",
"Skilled in version control using Git and GitHub.",
"Continuously seeking feedback to improve and grow as a developer.",
"Passionate about user-centered design principles and UX/UI.",
"Eager to collaborate with others and share knowledge within the team.",
"Experienced in optimizing SEO strategies for web content.",
"Proficient in front-end frameworks such as React and Angular JS.",
"Experienced in building and deploying cloud-based applications.",
"Strong problem-solving skills with a focus on efficiency.",
"Committed to delivering high-quality, user-friendly software.",
"Skilled in conducting usability tests and gathering user features.",
"Passionate about staying up-to-date with the latest trends.",
"Experienced in developing cross-platform applications.",
"Eager to tackle new challenges and push the boundaries of web development.",
"Experienced in working with databases such as MySQL, MongoDB, Firebase.",
"Skilled in implementing security best practices to protect data.",
"Passionate about continuous learning and personal development.",
"Experienced in developing e-commerce solutions with payment.",
"Strong analytical skills with a data-driven approach.",
"Committed to delivering projects on time and within budget.",
"Experienced in conducting code reviews and providing constant feedback.",
"Passionate about using technology for social good and communication.",
"Skilled in building responsive and adaptive user interfaces.",
"Enthusiastic about exploring emerging technologies and their use.",
"Experienced in building RESTful APIs for seamless integration.",
"Detail-oriented with a focus on delivering polished and user friendly apps.",
]

const userData = [];
const blogData = filteredBlogs;
const commentData = [];

console.timeLog("executionTime", "Variables created");

for (let [name, id] of userIdName) {
  let readArticles = [];
  
  // Generate random comments and reads
  for (let i = 0; i < randomInt(20, 100); i++) {
    const randomBlog = blogData[randomInt(0, blogData.length - 1)];
    if(randomBlog) {
        const commentId = convertNumberToId(commentData.length + 1, "comment");
        commentData.push({
          _id: commentId,
          message: randomComments[randomInt(0, randomComments.length - 1)],
          author: id,
        });
        
        randomBlog.views += 1;
        readArticles.push(randomBlog._id);
        randomBlog.comments.push(commentId);
        randomBlog.commentsCount++;
    }
  }

  // Generate likes
  for (let i = 0; i < randomInt(50, 100); i++) {
    const randomBlog = blogData[randomInt(0, blogData.length - 1)];
     if(randomBlog) {
        randomBlog.views += 1;
        readArticles.push(randomBlog._id);
        randomBlog.likes.push(id);
        randomBlog.likesCount++;
     }
  }

  let myBlogs = blogData
    .filter((blog) => blog.author === id)
    .map((blog) => blog._id);

  let myInterests = [];
  for (let i = 0; i < randomInt(1, 5); i++) {
    myInterests.push(tagArray[randomInt(0, tagArray.length - 1)]);
  }

  userData.push({
    _id: id,
    name: name.substring(0, 50), // Ensure name isn't too long
    email: faker.internet.email({ firstName: name.split(" ")[0] }),
    password: bcrypt.hashSync("password", 5),
    profileImage: faker.image.avatar(),
    bio: bioData[randomInt(0, bioData.length - 1)],
    blogs: myBlogs,
    myInterests,
    readArticles,
    following: [],
    followers: [],
  });
}

console.timeLog("executionTime", "User data created");

// Change pass and email for account "Hello"
if (userData.length > 0) {
    userData[0].email = "hello@hello.com"
    userData[0].password = bcrypt.hashSync("hello@hello.com", 10)
}

// Generate Followers/Following
for (let user of userData) {
    for (let i = 0; i < randomInt(2, 100); i++) {
        const randomUser = userData[randomInt(0, userData.length - 1)]
        if (randomUser && randomUser._id !== user._id) {
            user.following.push(randomUser._id)
            randomUser.followers.push(user._id)
        }
    }
}

console.timeLog("executionTime", "Followers and following created")
console.log("Data generated")
console.timeEnd("executionTime")

module.exports = {
    blogData,
    userData,
    commentData,
}