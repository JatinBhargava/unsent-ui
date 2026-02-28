pipeline {
  agent any

  environment {
    IMAGE_NAME = "jatindocker623/unsent-ui"
    IMAGE_TAG  = "latest"
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

    stage('Build Docker Image') {
      steps {
        sh '''
          docker build -t $IMAGE_NAME:$IMAGE_TAG .
        '''
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $IMAGE_NAME:$IMAGE_TAG
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