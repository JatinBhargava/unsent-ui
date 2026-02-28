pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "jatindocker623"
        IMAGE_NAME = "unsent-ui"
    }

    stages {

        stage('Install & Build') {
            steps {
                sh 'node -v'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def tag = "1.0.0-SNAPSHOT"
                    sh """
                        docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${tag} .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                        docker logout
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Frontend deployed successfully 🚀"
        }
        failure {
            echo "Frontend build failed ❌"
        }
    }
}