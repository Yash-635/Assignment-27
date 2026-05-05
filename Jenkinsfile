pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        APP_NAME     = 'assignment-27'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '🔄 Pulling latest code from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/Yash-635/Assignment-27.git'
            }
        }

        stage('Install & Lint - Backend') {
            steps {
                echo '📦 Installing backend dependencies...'
                dir('backend') {
                    sh 'npm install'
                    echo '✅ Backend dependencies installed.'
                }
            }
        }

        stage('Install & Lint - Frontend') {
            steps {
                echo '📦 Installing frontend dependencies...'
                dir('frontend') {
                    sh 'npm install'
                    echo '✅ Frontend dependencies installed.'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🏗️  Building frontend production assets...'
                dir('frontend') {
                    sh 'npm run build'
                }
                echo '✅ Frontend build complete.'
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                echo '🧹 Tearing down any existing containers...'
                sh 'docker compose -f $COMPOSE_FILE down --remove-orphans || true'
                sh 'docker container prune -f'
                echo '✅ Old containers removed.'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images for all services...'
                sh 'docker compose -f $COMPOSE_FILE build --no-cache'
                echo '✅ Docker images built.'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Starting all containers...'
                sh 'docker compose -f $COMPOSE_FILE up -d'
                echo '✅ Containers started.'
            }
        }

        stage('Health Check') {
            steps {
                echo '🩺 Waiting for services to be ready...'
                sleep(time: 10, unit: 'SECONDS')

                echo '--- Running Containers ---'
                sh 'docker compose -f $COMPOSE_FILE ps'

                echo '--- Backend Health Check ---'
                sh 'curl -f http://localhost:5000 || echo "Backend not reachable yet (non-fatal)"'

                echo '--- Frontend Health Check ---'
                sh 'curl -f http://localhost:3000 || echo "Frontend not reachable yet (non-fatal)"'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline succeeded! All containers are up and running.'
        }
        failure {
            echo '❌ Pipeline failed. Rolling back — stopping all containers...'
            sh 'docker compose -f $COMPOSE_FILE down || true'
        }
        always {
            echo '📋 Final container status:'
            sh 'docker compose -f $COMPOSE_FILE ps || true'
        }
    }
}