
// Unit tests for: CommentList

import React from 'react'
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";
import CommentList from '../CommentList';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mocking dependencies
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("@/hooks/useFetch", () => ({
  useFetch: jest.fn(),
}));

jest.mock("@/helpers/getEnv", () => ({
  getEnv: () => 'http://mock-api.com',
}));

jest.mock("@radix-ui/react-avatar", () => ({
  Avatar: ({ children }) => <div>{children}</div>,
  AvatarImage: ({ src }) => <img src={src} alt="avatar" />,
}));

describe('CommentList() CommentList method', () => {
  beforeEach(() => {
    useSelector.mockReturnValue({
      user: {
        user: {
          name: 'Test User',
          avatar: 'test-avatar-url',
        },
      },
    });
  });

  describe('Happy Paths', () => {
    it('should render loading state initially', () => {
      // Mock useFetch to return loading state
      useFetch.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      render(<CommentList props={{ blogid: '123' }} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render comments when data is available', () => {
      // Mock useFetch to return data
      useFetch.mockReturnValue({
        data: {
          comments: [
            {
              _id: '1',
              user: { name: 'Commenter 1', avatar: 'avatar1-url' },
              createdAt: '2023-10-01T00:00:00Z',
              comment: 'This is a comment',
            },
          ],
        },
        loading: false,
        error: null,
      });

      render(<CommentList props={{ blogid: '123' }} />);
      expect(screen.getByText('1 Comments')).toBeInTheDocument();
      expect(screen.getByText('Commenter 1')).toBeInTheDocument();
      expect(screen.getByText('This is a comment')).toBeInTheDocument();
    });

    it('should render new comment if provided', () => {
      // Mock useFetch to return data
      useFetch.mockReturnValue({
        data: {
          comments: [],
        },
        loading: false,
        error: null,
      });

      const newComment = {
        createdAt: '2023-10-02T00:00:00Z',
        comment: 'New comment',
      };

      render(<CommentList props={{ blogid: '123', newComment }} />);
      expect(screen.getByText('1 Comments')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('New comment')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle no comments gracefully', () => {
      // Mock useFetch to return empty comments
      useFetch.mockReturnValue({
        data: {
          comments: [],
        },
        loading: false,
        error: null,
      });

      render(<CommentList props={{ blogid: '123' }} />);
      expect(screen.getByText('0 Comments')).toBeInTheDocument();
    });

    it('should handle error state gracefully', () => {
      // Mock useFetch to return error
      useFetch.mockReturnValue({
        data: null,
        loading: false,
        error: 'Error fetching comments',
      });

      render(<CommentList props={{ blogid: '123' }} />);
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Comments')).not.toBeInTheDocument();
    });
  });
});

// End of unit tests for: CommentList
