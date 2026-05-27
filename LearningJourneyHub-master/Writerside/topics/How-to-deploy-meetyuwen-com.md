# How to Deploy meetyuwen.com

This guide outlines the steps to deploy updates to `meetyuwen.com`, ensuring that the website reflects the latest changes. By following this procedure, you'll update your website content and server configuration, suitable for web developers managing personal or professional sites.

> **Highlight important information**
>
> Backup existing site data before proceeding to prevent unintended data loss.
>
{style="note"}

## Before you start

Ensure the following prerequisites are met for a smooth deployment:

- Access to the Azure Linux VM via SSH.
- The updated website content zipped in `build.zip`.
- Nginx is already installed and running on the VM.

## Deploying the React Application

Begin by accessing your VM:

1. **Unzipping `build.zip`**

   ```bash
   unzip build.zip -d /home/azureuser/
   ```
2. **Removing the Old Build Folder**

   Navigate to the /var/www/portfolio directory and remove the old build folder.
   ```bash
   rm -rf /var/www/portfolio/build
   ```
3. **Moving the New Build Folder**

   Move the unzipped build folder to the /var/www/portfolio directory.

   ```bash
   mv /home/azureuser/build /var/www/portfolio/
   ```
4. **Restarting Nginx**

   Restart Nginx to apply the changes.
   ```bash
   sudo systemctl restart nginx
   ```

### Deploying with a Script

1. **Upload the `build.zip` file** to the `/home/azureuser/` directory.

2. **Run the deployment script**:

   ```bash
   /home/azureuser/deploy.sh
   ```

## Deploying the Spring Boot Application

1. **Upload the JAR file**

   Upload the new JAR file to the /home/azureuser/ directory on the VM. For example, using SCP:

   ```bash
   scp path/to/your-application.jar azureuser@your-azure-server:/home/azureuser/
   ```
2. **Stop the current running Spring Boot application**

   Ensure the old version of the Spring Boot application is stopped. You can use the following command to find and kill the old process:

   ```bash
   sudo pkill -f 'java -jar'
   ```
3. **Delete the old JAR file and log file**

   Navigate to the Spring Boot application's deployment directory and delete the old JAR file and log file. For example, if the application is deployed in /srv/springapp:

   ```bash
   rm /srv/springapp/your-application.jar
   rm /srv/springapp/nohup.out
   ```
4. **Move the new JAR file**

   Move the uploaded new JAR file to the application's deployment directory:
   ```bash
   mv /home/azureuser/your-application.jar /srv/springapp/
   ```

5. **Start the new Spring Boot application**

   Use the nohup command to start the new Spring Boot application in the background:

   ```bash
   cd /srv/springapp
   nohup java -jar your-application.jar &
   ```
6. **Verify the application has started successfully**

   Check the log file to ensure the application has started correctly:
   ```bash
   tail -f /srv/springapp/nohup.out
   ```