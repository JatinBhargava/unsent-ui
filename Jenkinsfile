pipeline {
  agent any

  environment {
    IMAGE_NAME = "jatindocker623/unsent-ui"
    IMAGE_TAG  = "26.1.1"
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {

    stage('Checkout') {
      when {
        expression { shouldRun('checkout') }
      }
      steps {
        checkout scm
      }
    }

    stage('Install & Build UI') {
      when {
        expression { shouldRun('build') }
      }
      agent {
        docker {
          image 'node:20-alpine'
          args '-u root'
        }
      }
      steps {
        sh '''
          node -v
          npm -v
          npm install
          npm run build
        '''
      }
    }

    stage('Build & Push Docker Image') {
      when {
        expression { shouldRun('docker') }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            docker buildx build \
              --platform linux/amd64 \
              -t $IMAGE_NAME:$IMAGE_TAG \
              --push .

            docker logout
          '''
        }
      }
    }
  }

  post {
    success {
      script {
        switch(env.BRANCH_NAME) {
          case ~/feature\/.*/: {
            echo "Feature Branch Build SUCCESS ✅ (Build only)"
            break
          }
          case 'develop':
          case 'master':
          case 'main': {
            echo "CI/CD Pipeline SUCCESS ✅ (Build + Docker Publish)"
            break
          }
          default: {
            echo "Pipeline SUCCESS ✅"
          }
        }
      }
    }
    failure {
      echo "Pipeline FAILED ❌"
    }
  }
}

def shouldRun(String stage) {
  switch (true) {
    case env.BRANCH_NAME?.startsWith("feature/"):
      return ["checkout", "build"].contains(stage)

    case env.BRANCH_NAME == "develop":
      return ["checkout", "build", "docker"].contains(stage)

    case env.BRANCH_NAME == "master":
      return ["checkout", "build", "docker"].contains(stage)

    case env.BRANCH_NAME == "main":
      return ["checkout", "build", "docker"].contains(stage)

    default:
      return false
  }
}