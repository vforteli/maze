# dotnet tool install --global vforteli.TypeScriptHubGenerator

dotnet build ./backend 
dotnet tshubgen \
    -f "./backend/mazebackend/bin/Debug/net8.0/mazebackend.dll" \
    -o "./frontend/src/generated/hubs/" \
    --create-react-context
    