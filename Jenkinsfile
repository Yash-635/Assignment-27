pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker images...'
                bat 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Stopping any existing containers...'
                bat 'docker compose down'
                echo 'Starting containers...'
                bat 'docker compose up -d'
            }
        }

    }

    post {
        success {
            echo 'Pipeline succeeded! App is running.'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
            bat 'docker compose down'
        }
    }
}
