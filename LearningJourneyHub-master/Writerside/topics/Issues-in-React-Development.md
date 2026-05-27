# Issues in React Development

## How to Kill a Process Running on Port 3000

If you encounter an issue where port 3000 is already in use, you can kill the process running on that port with the following steps:

### For Mac/Linux:

1. Find the process ID (PID) running on port 3000:
   ```bash
   lsof -i :3000
   ```
2. Once you have the PID, kill the process:
    ```bash
   kill -9 <PID>
   ```
### For Windows:
1. Find the PID running on port 3000:
    ```Bash
    netstat -ano | findstr :3000
    ```

2. Kill the process using the taskkill command:
    ```Bash
    taskkill /PID <PID> /F
    ```
    Make sure to replace `<PID>` with the actual process ID obtained from the previous command.

