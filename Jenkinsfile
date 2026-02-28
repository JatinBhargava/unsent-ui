pipeline {
  agent any

  environment {
    IMAGE_NAME = "jatindocker623/unsent-ui"
    IMAGE_TAG  = "1.0.0-SNAPSHOT"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Build UI') {
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

    stage('Build & Push Docker Image (amd64)') {
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
      echo "Frontend CI SUCCESS ✅"
    }
    failure {
      echo "Frontend CI FAILED ❌"
    }
  }
}