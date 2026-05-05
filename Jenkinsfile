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
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Stopping any existing containers...'
                sh 'docker compose down'

                echo 'Starting containers...'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! App is running.'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
            sh 'docker compose down'
        }
    }
}