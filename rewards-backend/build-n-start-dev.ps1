# may need `PowerShell -ExecutionPolicy Bypass -File .\build-n-start-dev.ps1`
# 1. Build the shared library first and foremost
echo "Building Shared Library..."
dotnet build ./src/SharedValidator/SharedValidator.csproj -c Release

if ($LASTEXITCODE -ne 0) {
    echo "Shared library build failed!"
    exit 1
}

# 2. Now, run the SAM build
echo "Running sam build..."
sam build

# 3. Then run the local api
echo "Running sam local start-api..."
sam local start-api

