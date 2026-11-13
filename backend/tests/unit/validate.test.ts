import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { ZodError, z } from 'zod';
import { validate } from '../../src/middleware/validate.js';
import { sendSuccess } from '../../src/utils/response.js';

describe('validate middleware', () => {
  it('meneruskan ke next() dan mem-parsing body valid', () => {
    const schema = z.object({ title: z.string().trim().min(1) });
    const req = { body: { title: '  Belajar SAW  ' } } as Request;
    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    validate({ body: schema })(req, res, next);

    expect(req.body).toEqual({ title: 'Belajar SAW' });
    expect(next).toHaveBeenCalledWith();
  });

  it('meneruskan ZodError ke next(err) saat body tidak valid', () => {
    const schema = z.object({ price: z.number().positive() });
    const req = { body: { price: -100 } } as Request;
    const res = {} as Response;
    const next = vi.fn();

    validate({ body: schema })(req, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0]?.[0]).toBeInstanceOf(ZodError);
  });
});

describe('sendSuccess helper', () => {
  it('mengirim format respons sukses standar', () => {
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res = { status } as unknown as Response;

    sendSuccess(res, { ok: true }, 201);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      success: true,
      data: { ok: true },
    });
  });
});
