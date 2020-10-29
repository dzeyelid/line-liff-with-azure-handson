```bash
cd arm-templates

RESOURCE_GROUP=
LOCATION=japaneast

IDENTIFIER=
GITHUB_REPOSITORY_URL=https://github.com/<owner>/<repository>
GITHUB_ACCESS_TOKEN=

az login
az group create --resource-group ${RESOURCE_GROUP} --location ${LOCATION}

az deployment group validate \
  --resource-group ${RESOURCE_GROUP} \
  --template-file template.json \
  --parameters \
    identifier="${IDENTIFIER}" \
    staticWebAppRepositoryUrl="${GITHUB_REPOSITORY_URL}" \
    staticWebAppRepositoryToken="${GITHUB_ACCESS_TOKEN}"

az deployment group create \
  --resource-group ${RESOURCE_GROUP} \
  --template-file template.json \
  --parameters \
    identifier="${IDENTIFIER}" \
    staticWebAppRepositoryUrl="${GITHUB_REPOSITORY_URL}" \
    staticWebAppRepositoryToken="${GITHUB_ACCESS_TOKEN}"
```