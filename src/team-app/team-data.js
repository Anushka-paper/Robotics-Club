/**
 * Team data for Robotics Club, MMMUT
 * ------------------------------------------------------------------
 * All member info lives here, separate from UI components.
 *
 * REPLACING PLACEHOLDER IMAGES
 * Each member gets an auto-generated `image` path of the form
 * `/team/<slug-of-name>.jpg` (see `slugify` below). To use a real
 * photo, just add a file with that exact name to your project's
 * `public/team/` folder — no code changes required. If a file is
 * missing, TeamCard automatically falls back to a generated
 * initials avatar, so the page never breaks.
 *
 * If you'd rather point a specific member at a different filename
 * (e.g. a .png), just override `image` on that object after
 * `withImages(...)` runs.
 */

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function withImages(members) {
  return members.map((member) => ({
    ...member,
    image: member.image || `team-photos/${slugify(member.name)}.jpg`,
  }));
}

export const facultyAdvisors = withImages([
  { name: "Prof. B.K. Pandey", role: "Faculty", department: "", image: "team/bk-pandey.jpg", category: "Faculty" },
  { name: "Dr. Pallav Gupta", role: "Faculty", department: "", image: "team/pallav-gupta.jpg", category: "Faculty" },
  { name: "Dr. Rajan Mishra", role: "Faculty", department: "", image: "team/rajan-mishra.jpg", category: "Faculty" },
  { name: "Dr. Prince Kumar Singh", role: "Faculty", department: "", category: "Faculty" },
  { name: "Dr. Vijay Shanker Chaudhary", role: "Faculty", department: "", category: "Faculty" },
]);

export const finalYearMembers = withImages([
  { name: "Devesh Kumar Gaurav", role: "President", department: "ECE" },
  { name: "Prateek Singh", role: "Vice-President", department: "CE" },
  { name: "Shivanya Dixit", role: "Vice-President", department: "EE" },
  { name: "Ayush Sachan", role: "Vice-President", department: "ECE" },
  { name: "Deepak", role: "Secretary", department: "CSE" },
  { name: "Nityanand Pathak", role: "Treasurer", department: "ECE" },
  { name: "Garima Yadav", role: "Treasurer", department: "EE" },
  { name: "Divyansh Mishra", role: "Treasurer", department: "ECE" },
  { name: "Vedant Batham", role: "Circuitry-3D Designing Head", department: "IT" },
  { name: "Badal Sharma", role: "Editorial and Content Research Head", department: "ECE" },
  { name: "Pranjal Shahi", role: "Media and Creation Head", department: "ECE" },
  { name: "Suryansh Pal Suryavanshi", role: "Video Editing Head", department: "EE" },
  { name: "Nishant Pandey", role: "Public Relations Head", department: "ME" },
  { name: "Nitin Gupta", role: "Graphic Design Head", department: "ECE-IoT" },
  { name: "Yashasvi Sharma", role: "Web and App Development Head", department: "CSE" },
  { name: "Ayush Nag", role: "Circuitry-3D Designing Head", department: "ECE-IoT" },
  { name: "Mansi Chaturvedi", role: "Editorial and Content Research Head", department: "EE" },
  { name: "Divas Kushwaha", role: "Media and Creation Head", department: "ECE" },
]);

export const thirdYearMembers = withImages([
  { name: "Aditya Bind", role: "Video Editing Lead", department: "ECE" },
  { name: "Aditya Pratap Singh", role: "Video Editing Lead", department: "ECE" },
  { name: "Anisha Singh", role: "Media and Sponsorship Lead", department: "ECE" },
  { name: "Anushka Singh", role: "Web and App Development Lead", department: "CSE" },
  { name: "Apurv Mishra", role: "Circuitry-3D Design Lead", department: "ECE-IoT" },
  { name: "Aradhya Singh", role: "Editorial and Content Research Lead", department: "CSE" },
  { name: "Ayushi Srivastava", role: "Media and Sponsorship Lead", department: "BBA" },
  { name: "Dhruv Mishra", role: "Circuitry-3D Design Lead", department: "ECE-IoT" },
  { name: "Harshika Gautam", role: "Media and Sponsorship Lead", department: "ECE" },
  { name: "Ishan Dixit", role: "Web and App Development Lead", department: "ECE-IoT" },
  { name: "Janhavi Tiwari", role: "Graphics Design Lead", department: "ECE-IoT" },
  { name: "Kshitiz Gaur", role: "Media and Sponsorship Lead", department: "ECE" },
  { name: "Mohammad Samir", role: "Circuitry-3D Design Lead", department: "ECE-IoT" },
  { name: "Prathmesh Dev", role: "Public Relations Lead", department: "ME" },
  { name: "Rishika Khatri", role: "Graphics Design Lead", department: "EE" },
  { name: "Rohini Rajput", role: "Public Relations Lead", department: "ECE" },
  { name: "Saloni Yadav", role: "Editorial and Content Research Lead", department: "ECE" },
  { name: "Srishti Tripathi", role: "Editorial and Content Research Lead", department: "EE" },
  { name: "Srishti Yadav", role: "Graphics Design Lead", department: "ECE-IoT" },
  { name: "Swaraj Kumar", role: "Public Relations Lead", department: "ECE-IoT" },
]);

export const secondYearMembers = withImages([
  { name: "Aadi Siddharth", role: "Executive Member", department: "ECE" },
  { name: "Abhishek Agrahari", role: "Executive Member", department: "ECE" },
  { name: "Aditya Abhishek Tripathi", role: "Executive Member", department: "ECE" },
  { name: "Aditya Mishra", role: "Executive Member", department: "ECE" },
  { name: "Akanksha Patel", role: "Executive Member", department: "ECE-IoT" },
  { name: "Aniket Singh", role: "Executive Member", department: "EE" },
  { name: "Animesh Yadav", role: "Executive Member", department: "ECE-IoT" },
  { name: "Ansh Pandey", role: "Executive Member", department: "ECE-IoT" },
  { name: "Anshika Kumari", role: "Executive Member", department: "ECE" },
  { name: "Arjun Rastogi", role: "Executive Member", department: "ECE" },
  { name: "Atul Singh", role: "Executive Member", department: "EE" },
  { name: "Ayush Mishra", role: "Executive Member", department: "ME" },
  { name: "Ishita Gupta", role: "Executive Member", department: "ECE-IoT" },
  { name: "Krishna Porwal", role: "Executive Member", department: "EE" },
  { name: "Mridul Srivastava", role: "Executive Member", department: "IT" },
  { name: "Nityam Sahu", role: "Executive Member", department: "ECE" },
  { name: "Prabhat Kaushal", role: "Executive Member", department: "ECE" },
  { name: "Samriddhi Srivastava", role: "Executive Member", department: "EE" },
  { name: "Shashikant", role: "Executive Member", department: "ECE-IoT" },
  { name: "Shivakant Pandey", role: "Executive Member", department: "ECE-IoT" },
  { name: "Tanu Pandey", role: "Executive Member", department: "CE" },
]);
