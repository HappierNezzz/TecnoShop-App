import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <h2>Proyecto</h2>
      <p class="tagline">Liga de Superhéroes</p>

      <div class="about-card">
        <p>
          Este es un proyecto web moderno diseñado para la gestión y catalogación.
          Diseñado para la práctica de software.
        </p>

        <div class="tech-grid">
          <div class="tech-item">
            <strong>Frontend</strong>
            <span>Angular & TypeScript</span>
          </div>
          <div class="tech-item">
            <strong>Backend</strong>
            <span>Node.js, Express & Knex.js</span>
          </div>
          <div class="tech-item">
            <strong>Base de Datos</strong>
            <span>PostgreSQL & pgAdmin 4</span>
          </div>
          <div class="tech-item">
            <strong>Seguridad</strong>
            <span>JWT & Bcrypt</span>
          </div>
        </div>

        <p class="footer-note">
          Diseñado por 23040257 - Ingrid Cosio
        </p>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      text-align: center;

      h2 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 5px;
        font-weight: 800;
      }

      .tagline {
        color: #7f8c8d;
        font-size: 1.2rem;
        margin-bottom: 30px;
      }
    }

    .about-card {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      font-size: 1.1rem;
      line-height: 1.6;
      color: #34495e;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .tech-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #eee;

      strong {
        display: block;
        color: #e74c3c;
        margin-bottom: 5px;
      }

      span {
        font-size: 0.95rem;
        color: #555;
      }
    }

    .footer-note {
      margin-top: 30px;
      font-size: 0.95rem;
      color: #95a5a6;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  `]
})
export class About {}
