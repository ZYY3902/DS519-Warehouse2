# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:3.0-appservice
FROM mcr.microsoft.com/azure-functions/node:3.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    queueConnectionString="DefaultEndpointsProtocol=https;AccountName=assignment5storages;AccountKey=CKqFXFs7o6y8d4dMfJF7/vaL0x7CDdGXXO6/5BLtcOSx85KqKzBqHeAEvOH05+HHM9oZxwmPra4++AStsXqWrA==;EndpointSuffix=core.windows.net" \
    cosmosDBConnectionString="AccountEndpoint=https://assignment4-db.documents.azure.com:443/;AccountKey=C9AoIod2oGDn6DFpWFxENKWUGiHEZCKNrG9NUzkmnR4TRSBZRFkYA2vo2Rd537QqmsZoBlU7SbqcACDbAiPdoA==;"\
    AzureWebJobsqueueConnectionString="DefaultEndpointsProtocol=https;AccountName=assignment5storages;AccountKey=CKqFXFs7o6y8d4dMfJF7/vaL0x7CDdGXXO6/5BLtcOSx85KqKzBqHeAEvOH05+HHM9oZxwmPra4++AStsXqWrA==;EndpointSuffix=core.windows.net"

COPY . /home/site/wwwroot

RUN cd /home/site/wwwroot && \
    npm install