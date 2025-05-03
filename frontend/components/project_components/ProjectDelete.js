export default async function deleteProject({project_id}) {
    try {
      const deleteRequest = fetch(      "https://square-scan.onrender.com/deleteproject",
{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
        project_id:project_id
    })
}      )
    return "Project sucessfully deleted"
}
    catch (e) {
      console.log("Error in delete project function: ", e)
    }
  }