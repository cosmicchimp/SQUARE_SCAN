export default async function signUpUser (email, password, verifypassword) {
  try {
    app.use(express.json());
    app.use(cors());
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const validsymbols = ["!","@","#","$","%","^","&","*"]
    //Helper functions to validate and sanitize the users emails on signup
    // Load the disposable email domains into a Set for efficient lookup
    const disposableDomains = new Set(
      fs.readFileSync(path.join(__dirname, '../data/disposable_email_blocklist.conf'), 'utf-8')
        .split('\n')
        .map(domain => domain.trim().toLowerCase())
        .filter(Boolean)
    );
    function isValidEmailFormat(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      return regex.test(email); 
    }
    function symbolCheck(password) {
      let valid = false
      validsymbols.forEach((symbol) => {
        if (password.includes(symbol)) {
          valid = true
        }
      }) 
      return valid
    }
    function isPasswordValid(password, verifypassword) {
    if (password.length < 9 || !symbolCheck(password) ||  password !== verifypassword) {
      return false
    }
    else {
      return true
    }
    }
    function isAllowedEmail(email) {
      if (!isValidEmailFormat(email)) return false;
      const domain = email.split('@')[1].toLowerCase();
      return !disposableDomains.has(domain);
    }
    console.log(`pass, verify pass: ${password} ${verifypassword}`)
    //testing the email validity before running the user account creation
    if (!isAllowedEmail(email) || !isPasswordValid(password, verifypassword)) {    
      return false
    }
    else {
    const encryptedpass = await bcrypt.hash(password, 10); // Make sure to await bcrypt.hash
      await sql`
        INSERT INTO userbase.users(email, password, created_at) 
        VALUES (${email}, ${encryptedpass}, NOW())
      `;
      console.log("User created");
      return true; // Return a result indicating success}
    }
  } catch (e) {
    console.log("Error: " + e);
    return false; // Return false in case of an error
  }

}