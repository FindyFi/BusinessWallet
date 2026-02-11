import { Router } from 'express';
import type { Request, Response } from 'express';
import { CredentialService } from '../domain/credential-service.js';
import { CredentialRepository } from '../infrastructure/credential-repository.js';
import type { CreateCredentialRequest } from '../types/credential.js';

const router = Router();
const credentialService = new CredentialService();
const credentialRepository = new CredentialRepository();

/**
 * POST /api/v1/credentials
 * Issues a new verifiable credential
 */
router.post('/credentials', async (req: Request, res: Response) => {
  try {
    const request = req.body as CreateCredentialRequest;

    // Basic validation
    if (!request.issuer) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'issuer is required',
      });
      return;
    }

    if (!request.credentialSubject) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'credentialSubject is required',
      });
      return;
    }

    // Issue the credential
    const credential = await credentialService.issueCredential(request);

    // Store the credential
    const holderId = request.credentialSubject.id as string | undefined;
    await credentialRepository.save(credential, holderId);

    res.status(201).json(credential);
  } catch (error) {
    console.error('Error issuing credential:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to issue credential',
    });
  }
});

/**
 * GET /api/v1/credentials/:id
 * Retrieves a credential by ID
 */
router.get('/credentials/:id', async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const credential = await credentialRepository.findById(id);

    if (!credential) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Credential not found',
      });
      return;
    }

    res.status(200).json(credential);
  } catch (error) {
    console.error('Error retrieving credential:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve credential',
    });
  }
});

/**
 * GET /api/v1/credentials
 * Retrieves all credentials (or by holderId if provided)
 */
router.get('/credentials', async (req: Request, res: Response) => {
  try {
    const holderId = req.query.holderId as string | undefined;

    const credentials = holderId
      ? await credentialRepository.findByHolderId(holderId)
      : await credentialRepository.findAll();

    res.status(200).json(credentials);
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve credentials',
    });
  }
});

export default router;
