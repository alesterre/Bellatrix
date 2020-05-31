FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build

# install NodeJS 13.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

# Copy everything and build
COPY . app/

WORKDIR /app

RUN ls

RUN dotnet restore "bellatrix.csproj"
RUN dotnet publish "bellatrix.csproj" -c Release -o /out

RUN ls

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build /out .
RUN ls
ENTRYPOINT ["dotnet", "bellatrix.dll"]