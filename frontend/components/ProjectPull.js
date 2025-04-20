const ProjectPull = async ({ currentUser }) => {
  try {
    console.log("current user from project pull.js: ", currentUser);
    const projectFetch = await fetch(
      "https://square-scan.onrender.com/projectpull",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: currentUser }),
      }
    );
    const query = await projectFetch.json();
    return query;
  } catch (e) {
    console.log("Error: ", e);
  }
};
export default ProjectPull;
