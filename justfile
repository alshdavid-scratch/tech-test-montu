set windows-shell := ["pwsh", "-NoLogo", "-NoProfileLoadTime", "-Command"]

build:
  cd client && just build

dev *ARGS:
  cd client && just dev {{ARGS}}

test:
  cd client && just test

deploy *ARGS:
  cd terraform && terraform init && terraform validate && terraform apply {{ARGS}}