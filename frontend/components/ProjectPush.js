export default async ({
  project_name,
  creator_email,
  address,
  updateDataStatus,
}) => {
  try {
    console.log("PARAMETERS: ", project_name, creator_email, address);
    const datapush = await fetch(
      "https://square-scan.onrender.com/projectpush",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: project_name,
          creator_email: creator_email,
          address: address,
        }),
      }
    );
    const returnmessage = await datapush.json();
    console.log("Message from server: ", returnmessage.message);
    updateDataStatus("Updated");
  } catch (e) {
    console.log("Error: ", e);
  }
};
